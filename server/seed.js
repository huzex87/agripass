const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const {
  Organization,
  User,
  Beneficiary,
  Project,
  Disbursement,
  Wallet,
  LocationReference
} = require("./Database_Models/Models");
require("dotenv").config();

const MONGODB_URL = process.env.MONGODB_URL || "mongodb://localhost:27017/agripass";

async function seedDatabase() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URL);
    console.log("MongoDB Connected. Clearing existing collections...");

    // Clear collections
    await Organization.deleteMany({});
    await User.deleteMany({});
    await Beneficiary.deleteMany({});
    await Project.deleteMany({});
    await Disbursement.deleteMany({});
    await Wallet.deleteMany({});
    await LocationReference.deleteMany({});
    console.log("Collections cleared successfully.");

    // Hashing passwords
    const saltRounds = 10;
    const defaultPasswordHash = await bcrypt.hash("Password123!", saltRounds);

    // 0. Seed Location References (Katsina State pilot dataset)
    console.log("Seeding Katsina state location reference data...");
    await LocationReference.create([
      {
        state: "Katsina",
        lga: "Batagarawa",
        ward: "Batagarawa A",
        pollingUnits: ["001 - Batagarawa Primary School", "002 - Dispensary", "003 - Open Space"]
      },
      {
        state: "Katsina",
        lga: "Batagarawa",
        ward: "Batagarawa B",
        pollingUnits: ["001 - Central Mosque", "002 - Village Square", "003 - Cooperative Office"]
      },
      {
        state: "Katsina",
        lga: "Batagarawa",
        ward: "Ajiwa",
        pollingUnits: ["001 - Ajiwa Primary School", "002 - Market Square", "003 - Dam Area"]
      },
      {
        state: "Katsina",
        lga: "Batagarawa",
        ward: "Dandutse",
        pollingUnits: ["001 - Dandutse Clinic", "002 - Primary School", "003 - Town Hall"]
      },
      {
        state: "Katsina",
        lga: "Katsina",
        ward: "Wakilin Kudu",
        pollingUnits: ["001 - Palace Gate", "002 - Kofar Kudu Primary School", "003 - Veterinary Clinic"]
      },
      {
        state: "Katsina",
        lga: "Katsina",
        ward: "Wakilin Yamma",
        pollingUnits: ["001 - Kofar Yamma School", "002 - Open Space Yamma", "003 - Dispensary Yamma"]
      }
    ]);
    console.log("Katsina location references seeded successfully!");

    // 1. Seed AgriPass Organization (Cooperative Apex)
    console.log("Seeding default cooperative organization...");
    const organization = await Organization.create({
      name: "Katsina Wheat Farmers Cooperative",
      subdomain: "katsina-agro",
      email: "info@katsinaagro.org",
      phone: "+2348031234567",
      password: defaultPasswordHash,
      status: "active",
    });
    console.log(`Organization seeded: ${organization.name} (Subdomain: ${organization.subdomain})`);

    // 2. Seed Organization Admin User
    console.log("Seeding organization admin user...");
    const adminUser = await User.create({
      organizationId: organization._id,
      firstName: "Musa",
      lastName: "Ibrahim",
      email: "admin@katsinaagro.org",
      password: defaultPasswordHash,
      role: "admin",
    });
    console.log(`Admin user seeded: ${adminUser.email}`);

    // 3. Seed Farmer Beneficiary
    console.log("Seeding default farmer beneficiary...");
    const beneficiary = await Beneficiary.create({
      personalDetails: {
        firstName: "Sani",
        lastName: "Abubakar",
        gender: "male",
        dateOfBirth: new Date("1988-10-12"),
        phone: "+2348099887766",
        email: "sani.abubakar@gmail.com",
        password: defaultPasswordHash,
      },
      identification: {
        idType: "national_id",
        idNumber: "55554444333",
        verified: true,
      },
      status: "approved",
      location: {
        state: "Katsina",
        senatorialDistrict: "Katsina Central",
        lga: "Batagarawa",
        ward: "Batagarawa A",
        pollingUnit: "001 - Batagarawa Primary School",
      },
      agriculturalProfile: {
        cropsGrown: ["Wheat", "Maize"],
        plots: [
          {
            polygon: {
              type: "Polygon",
              coordinates: [
                [
                  [7.5000, 11.9000],
                  [7.5100, 11.9000],
                  [7.5100, 11.9100],
                  [7.5000, 11.9100],
                  [7.5000, 11.9000]
                ]
              ]
            },
            hectarage: 2.5,
            tenureStatus: "owned"
          }
        ],
        householdSize: 6,
        vulnerabilityFlags: {
          isFemaleHead: false,
          hasDisability: false
        }
      }
    });
    console.log(`Farmer beneficiary seeded: ${beneficiary.personalDetails.email}`);

    // 4. Seed AgriPass Project (dry-season wheat intervention)
    console.log("Seeding dry-season wheat intervention project...");
    const project = await Project.create({
      organizationId: organization._id,
      name: "Katsina Dry-Season Wheat Program",
      description: "Providing wheat seeds, urea fertilizer, and crop protection chemicals to registered smallholder farmers under subsidised co-payment financing.",
      type: "subsidy",
      budget: {
        amount: 15000000,
        currency: "NGN",
      },
      startDate: new Date(),
      endDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 180 days from now
      status: "active",
      hasCustomForm: true,
      customForm: {
        title: "Wheat Input Application Form",
        description: "Verify your farm plot hectarage and select input requirements.",
        fields: [
          {
            id: "inputs_required",
            type: "select",
            label: "Input Package Option",
            placeholder: "Select your input package",
            required: true,
            options: ["Basic Package (2 bags Fertilizer + 50kg Seeds)", "Standard Package (4 bags Fertilizer + 100kg Seeds)"],
            order: 1
          }
        ]
      }
    });
    console.log(`Project seeded: ${project.name}`);

    // 5. Seed Wallet for Farmer
    console.log("Seeding farmer wallet...");
    const wallet = await Wallet.create({
      beneficiaryId: beneficiary._id,
      balance: 15000, // Starting farmer balance/equity contribution
      currency: "NGN",
      status: "active"
    });
    console.log(`Wallet seeded. Balance: ${wallet.balance}`);

    // 6. Seed input disbursement with Murabaha repayment schedule
    console.log("Seeding input disbursement with Murabaha repayment schedule...");
    const disbursement = await Disbursement.create({
      projectId: project._id,
      beneficiaryId: beneficiary._id,
      status: "approved",
      currency: "NGN",
      disbursementDate: new Date(),
      repaymentSchedule: [
        {
          dueDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000), // 120 days (post-harvest)
          amount: 35000, // Co-payment amount to be recovered post-harvest
          status: "pending",
          repaymentType: "Murabaha"
        }
      ]
    });
    console.log(`Disbursement seeded with ${disbursement.repaymentSchedule.length} repayment installments.`);

    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Seeding error:", error);
  } finally {
    await mongoose.connection.close();
    console.log("MongoDB connection closed.");
  }
}

seedDatabase();
