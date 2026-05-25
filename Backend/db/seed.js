import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import path from "path";
import { fileURLToPath } from "url";

// Configure dotenv
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import User from "../models/user_model.js";
import Company from "../models/company_model.js";
import Location from "../models/locations_models.js";
import Product from "../models/product_model.js";
import History from "../models/history_model.js";

const manufacturers = [
  { name: "Dell", description: "Dell Inc. Enterprise and Consumer Hardware" },
  { name: "HP", description: "HP Inc. Computers and Printers" },
  { name: "Cisco", description: "Cisco Systems, Inc. Networking Hardware" },
  { name: "Apple", description: "Apple Inc. Consumer Electronics and Workstations" },
  { name: "Ubiquiti", description: "Ubiquiti Inc. Networking and Wireless Devices" },
  { name: "Lenovo", description: "Lenovo Group Limited PC and Server Systems" },
  { name: "APC", description: "American Power Conversion UPS and Power Solutions" },
  { name: "Synology", description: "Synology Inc. Network Attached Storage Solutions" },
  { name: "Fortinet", description: "Fortinet Inc. Enterprise Network Security and Firewalls" },
];

const locations = [
  { name: "Server Room A", description: "Main data center server room, climate controlled" },
  { name: "IT Helpdesk Depot", description: "IT Support office and hardware storage" },
  { name: "Warehouse B", description: "Bulk storage warehouse for incoming hardware" },
  { name: "Finance Department", description: "Office space for the Finance department" },
  { name: "Main Office Suite 101", description: "General office desks and workstations" },
  { name: "Lab 3 Testing", description: "Development and testing laboratory room" },
];

const productTemplates = [
  { title: "Dell PowerEdge R750 Server", model: "PowerEdge R750", description: "2U Rack Server with Intel Xeon, 64GB RAM", rackMountable: true, isPart: false, category: "Server" },
  { title: "Dell PowerEdge R650 Server", model: "PowerEdge R650", description: "1U Rack Server with Intel Xeon, 32GB RAM", rackMountable: true, isPart: false, category: "Server" },
  { title: "HP ProLiant DL380 Gen10 Server", model: "ProLiant DL380", description: "2U Rack Server, AMD EPYC, 128GB RAM", rackMountable: true, isPart: false, category: "Server" },
  { title: "Lenovo ThinkSystem SR650 Server", model: "ThinkSystem SR650", description: "2U Rack Server with Intel Xeon, 64GB RAM", rackMountable: true, isPart: false, category: "Server" },
  
  { title: "Cisco Catalyst 9300 Switch", model: "Catalyst 9300", description: "48-Port UPOE Network Switch", rackMountable: true, isPart: false, category: "Switch" },
  { title: "Cisco Catalyst 9200 Switch", model: "Catalyst 9200", description: "24-Port PoE+ Network Switch", rackMountable: true, isPart: false, category: "Switch" },
  { title: "Ubiquiti UniFi Switch 24 POE", model: "USW-24-POE", description: "24-Port Gigabit Switch with PoE+", rackMountable: true, isPart: false, category: "Switch" },
  { title: "Aruba CX 6000 Switch", model: "CX 6000", description: "48-Port Gig PoE Switch", rackMountable: true, isPart: false, category: "Switch" },
  
  { title: "MacBook Pro 16\"", model: "M3 Max MacBook Pro 16", description: "Apple M3 Max Chip, 36GB Unified Memory, 1TB SSD", rackMountable: false, isPart: false, category: "Laptop" },
  { title: "MacBook Air 13\"", model: "M3 MacBook Air 13", description: "Apple M3 Chip, 16GB Unified Memory, 512GB SSD", rackMountable: false, isPart: false, category: "Laptop" },
  { title: "ThinkPad X1 Carbon Gen 11", model: "ThinkPad X1 Carbon", description: "Intel Core i7, 32GB RAM, 1TB SSD", rackMountable: false, isPart: false, category: "Laptop" },
  { title: "Dell XPS 15 9530", model: "XPS 15 9530", description: "Intel Core i9, 32GB RAM, RTX 4060, 1TB SSD", rackMountable: false, isPart: false, category: "Laptop" },
  { title: "HP EliteBook 840 G10", model: "EliteBook 840 G10", description: "Intel Core i7, 16GB RAM, 512GB SSD", rackMountable: false, isPart: false, category: "Laptop" },
  
  { title: "Cisco ISR 4331 Router", model: "ISR 4331", description: "Integrated Services Router for Enterprise", rackMountable: true, isPart: false, category: "Router" },
  { title: "Ubiquiti EdgeRouter 4", model: "ER-4", description: "4-Port Gigabit Router SFP", rackMountable: true, isPart: false, category: "Router" },
  
  { title: "Fortinet FortiGate 60F Firewall", model: "FortiGate 60F", description: "Next-Generation Firewall Security Appliance", rackMountable: false, isPart: false, category: "Firewall" },
  { title: "Palo Alto PA-440 Firewall", model: "PA-440", description: "Next-Gen Firewall for Branches and Small Offices", rackMountable: true, isPart: false, category: "Firewall" },
  
  { title: "Dell UltraSharp U2723QE Monitor", model: "U2723QE", description: "27\" 4K USB-C Hub Monitor", rackMountable: false, isPart: false, category: "Monitor" },
  { title: "LG UltraFine 32UN880 Monitor", model: "32UN880", description: "32\" UHD Ergo IPS Monitor", rackMountable: false, isPart: false, category: "Monitor" },
  
  { title: "HP LaserJet Pro MFP M428fdw", model: "LaserJet Pro M428fdw", description: "Wireless Monochrome Laser Printer", rackMountable: false, isPart: false, category: "Printer" },
  
  { title: "APC Smart-UPS 1500VA", model: "Smart-UPS 1500", description: "1500VA/1000W LCD 2U Rackmount UPS", rackMountable: true, isPart: false, category: "UPS" },
  
  { title: "Synology DiskStation DS923+", model: "DS923+", description: "4-Bay DiskStation Network Attached Storage", rackMountable: false, isPart: false, category: "Storage" },
  
  { title: "Ubiquiti UniFi U6 Pro Access Point", model: "U6-Pro", description: "UniFi Wi-Fi 6 Professional Access Point", rackMountable: false, isPart: false, category: "Access Point" },
  
  { title: "Samsung 990 Pro 2TB SSD", model: "MZ-V9P2T0B", description: "NVMe M.2 Internal SSD", rackMountable: false, isPart: true, category: "Storage Part" },
  { title: "Crucial 32GB DDR5 RAM", model: "CT32G56C46S5", description: "5600MHz DDR5 SODIMM Laptop Memory", rackMountable: false, isPart: true, category: "Memory Part" }
];

const seedDatabase = async () => {
  try {
    console.log("Connecting to database...");
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "ims",
    });
    console.log("Database connected successfully.");

    // 1. Seed or reuse Admin/User
    console.log("Seeding users...");
    let adminUser = await User.findOne({ email: "admin@ims.com" });
    if (!adminUser) {
      const hashedAdminPassword = await bcrypt.hash("adminpass123", 10);
      adminUser = await User.create({
        name: "Admin User",
        email: "admin@ims.com",
        password: hashedAdminPassword,
        role: "admin",
      });
      console.log("Admin user created: admin@ims.com / adminpass123");
    } else {
      console.log("Admin user already exists, reusing.");
    }

    let regularUser = await User.findOne({ email: "user@ims.com" });
    if (!regularUser) {
      const hashedUserPassword = await bcrypt.hash("userpass123", 10);
      regularUser = await User.create({
        name: "Standard User",
        email: "user@ims.com",
        password: hashedUserPassword,
        role: "user",
      });
      console.log("Standard user created: user@ims.com / userpass123");
    } else {
      console.log("Standard user already exists, reusing.");
    }

    // Clear existing Companies, Locations, Products, and Histories to start fresh
    console.log("Clearing existing Companies, Locations, Products, and Histories...");
    await Company.deleteMany({});
    await Location.deleteMany({});
    await Product.deleteMany({});
    await History.deleteMany({});

    // 2. Seed Companies
    console.log("Seeding companies...");
    const companyDocs = [];
    for (const manufacturer of manufacturers) {
      const doc = await Company.create({
        ...manufacturer,
        createdBy: adminUser._id,
      });
      companyDocs.push(doc);
    }
    console.log(`Successfully seeded ${companyDocs.length} companies.`);

    // 3. Seed Locations
    console.log("Seeding locations...");
    const locationDocs = [];
    for (const loc of locations) {
      const doc = await Location.create({
        ...loc,
        createdBy: adminUser._id,
      });
      locationDocs.push(doc);
    }
    console.log(`Successfully seeded ${locationDocs.length} locations.`);

    // Helper to get manufacturer ID by matching company name in product title
    const getManufacturerId = (title) => {
      const lowerTitle = title.toLowerCase();
      const matched = companyDocs.find((c) => lowerTitle.includes(c.name.toLowerCase()));
      return matched ? matched._id : companyDocs[Math.floor(Math.random() * companyDocs.length)]._id;
    };

    // 4. Seed Products and History
    console.log("Seeding 120 products and history records...");
    const productsToInsert = [];
    
    // We will generate 120 items
    const totalItems = 120;
    const statuses = ["in use", "repair", "not in use"];
    const userRoles = ["normal user", "department", "admin"];

    for (let i = 1; i <= totalItems; i++) {
      // Pick a random template
      const template = productTemplates[i % productTemplates.length];
      
      // Determine serial number, model suffix, etc.
      const serialNo = `SN-${template.category.substring(0, 3).toUpperCase()}-${100000 + i}`;
      const title = `${template.title} #${i}`;
      
      // Generate a date of purchase within the last 3 years
      const dateOfPurchase = new Date();
      dateOfPurchase.setMonth(dateOfPurchase.getMonth() - Math.floor(Math.random() * 36));

      // Warranty: 12, 24, 36, or 60 months
      const warrantyMonths = [12, 24, 36, 60][Math.floor(Math.random() * 4)];
      
      // Pick a random location
      const randomLocation = locationDocs[Math.floor(Math.random() * locationDocs.length)];
      
      // Pick a random status
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

      // Create History record first
      const historyDoc = await History.create({
        location: randomLocation._id,
        status: [
          {
            name: randomStatus,
            date: new Date(dateOfPurchase.getTime() + 24 * 60 * 60 * 1000), // Day after purchase
          }
        ]
      });

      // Product data
      const manufacturerId = getManufacturerId(template.title);
      const assignedUser = userRoles[Math.floor(Math.random() * userRoles.length)];

      const productDoc = {
        title,
        description: `${template.description} (Seeded Item #${i})`,
        serialNo,
        createdBy: adminUser._id,
        rackMountable: template.rackMountable,
        isPart: template.isPart,
        manufacturer: manufacturerId,
        model: `${template.model}-${i}`,
        dateOfPurchase,
        warrantyMonths,
        user: assignedUser,
        history: [historyDoc._id],
      };

      productsToInsert.push(productDoc);
    }

    // Insert all products
    const seededProducts = await Product.insertMany(productsToInsert);
    console.log(`Successfully seeded ${seededProducts.length} products.`);

    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed.");
  }
};

seedDatabase();
