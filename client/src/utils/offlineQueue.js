import api from "./Api";
import { toast } from "sonner";

const DB_NAME = "agripass-offline";
const DB_VERSION = 1;
const STORE_NAME = "registrations";

// Initialize IndexedDB
const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (e) => {
      console.error("IndexedDB open error:", e);
      reject(e.target.error);
    };

    request.onsuccess = (e) => {
      resolve(e.target.result);
    };

    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
  });
};

// Queue registration locally
export const addOfflineRegistration = async (projectId, data) => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);

      const record = {
        id: Date.now().toString(),
        projectId,
        data,
        createdAt: new Date().toISOString()
      };

      const request = store.add(record);

      request.onsuccess = () => {
        toast.info("Offline Mode", {
          description: "Registration saved locally. It will auto-sync when connection returns!"
        });
        resolve(true);
      };

      request.onerror = (e) => {
        reject(e.target.error);
      };
    });
  } catch (err) {
    console.error("Failed to add to offline queue:", err);
    throw err;
  }
};

// Retrieve all queued registrations
export const getOfflineRegistrations = async () => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result || []);
      };

      request.onerror = (e) => {
        reject(e.target.error);
      };
    });
  } catch (err) {
    console.error("Failed to fetch offline queue:", err);
    return [];
  }
};

// Delete a queued registration
export const removeOfflineRegistration = async (id) => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => {
        resolve(true);
      };

      request.onerror = (e) => {
        reject(e.target.error);
      };
    });
  } catch (err) {
    console.error("Failed to delete offline queue item:", err);
  }
};

// Synchronize all queued registrations with the backend server
export const syncOfflineRegistrations = async () => {
  if (!navigator.onLine) return;

  const queued = await getOfflineRegistrations();
  if (queued.length === 0) return;

  toast.info("Syncing Offline Data", {
    description: `Uploading ${queued.length} pending registration(s) to server...`
  });

  let successCount = 0;

  for (const record of queued) {
    try {
      const response = await api.post(`/api/v1/submit/${record.projectId}`, record.data);
      if (response.data?.success || response.status === 200 || response.status === 201) {
        await removeOfflineRegistration(record.id);
        successCount++;
      }
    } catch (err) {
      console.error(`Sync error for registration ${record.id}:`, err);
      // If server returns validation error (e.g. 400 Bad Request), discard to prevent blocking the queue
      if (err.response && err.response.status >= 400 && err.response.status < 500) {
        await removeOfflineRegistration(record.id);
      }
    }
  }

  if (successCount > 0) {
    toast.success("Sync Completed", {
      description: `${successCount} registration(s) successfully synchronized with server!`
    });
  }
};
