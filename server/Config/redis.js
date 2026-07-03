const { createClient } = require("redis");

let client;
let isRedisAvailable = false;

const memoryStore = new Map();
const memorySets = new Map();

// In-Memory Fallback Client for environments without Redis (like Serverless Vercel)
const mockRedisClient = {
  isOpen: true,
  connect: async () => {
    console.log("[Redis Fallback] Using In-Memory token store.");
    return;
  },
  setEx: async (key, seconds, value) => {
    memoryStore.set(key, value);
    // Auto-expiry simulation
    setTimeout(() => memoryStore.delete(key), seconds * 1000);
    return "OK";
  },
  sAdd: async (key, value) => {
    if (!memorySets.has(key)) {
      memorySets.set(key, new Set());
    }
    memorySets.get(key).add(value);
    return 1;
  },
  expire: async (key, seconds) => {
    setTimeout(() => {
      memorySets.delete(key);
    }, seconds * 1000);
    return 1;
  },
  get: async (key) => {
    return memoryStore.get(key) || null;
  },
  del: async (key) => {
    memoryStore.delete(key);
    return 1;
  },
  sRem: async (key, value) => {
    const set = memorySets.get(key);
    if (set) {
      set.delete(value);
    }
    return 1;
  },
  sMembers: async (key) => {
    const set = memorySets.get(key);
    return set ? Array.from(set) : [];
  },
  pipeline: () => {
    return {
      del: function(key) {
        memoryStore.delete(key);
        return this;
      },
      sRem: function(key, value) {
        const set = memorySets.get(key);
        if (set) set.delete(value);
        return this;
      },
      exec: async () => {
        return [];
      }
    };
  }
};

if (process.env.REDIS_URL) {
  try {
    client = createClient({
      url: process.env.REDIS_URL,
    });
    client.on("error", (err) => {
      console.log("Redis Client Error, switching to memory store:", err.message);
      isRedisAvailable = false;
    });
  } catch (err) {
    console.log("Failed to create Redis client, falling back to memory:", err.message);
    client = mockRedisClient;
  }
} else {
  console.log("REDIS_URL not set. Initializing In-Memory token store.");
  client = mockRedisClient;
}

async function connectRedis() {
  if (client === mockRedisClient) return;
  try {
    // Set a timeout of 3 seconds for Redis connection to prevent hanging
    const connectPromise = client.connect();
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("Redis connection timeout")), 3000)
    );
    await Promise.race([connectPromise, timeoutPromise]);
    isRedisAvailable = true;
    console.log("Redis Connected successfully!");
  } catch (err) {
    console.log("Redis Connection failed, falling back to In-Memory store:", err.message);
    client = mockRedisClient;
  }
}

connectRedis();

// Export a proxy to dynamically fallback if Redis fails after connecting
const clientProxy = new Proxy({}, {
  get: (target, prop) => {
    if (prop === "connect") {
      return async () => {
        if (client !== mockRedisClient) {
          try {
            await client.connect();
          } catch (e) {
            client = mockRedisClient;
          }
        }
      };
    }
    const activeClient = (isRedisAvailable && client) ? client : mockRedisClient;
    return typeof activeClient[prop] === 'function' 
      ? activeClient[prop].bind(activeClient) 
      : activeClient[prop];
  }
});

module.exports = clientProxy;
