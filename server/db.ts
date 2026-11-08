import fs from 'fs';
import path from 'path';

// Define DB file path
const DATA_DIR = path.resolve(process.cwd(), 'server', 'data');
const DB_FILE = path.resolve(DATA_DIR, 'db.json');

// Initial schema structure
export interface DBData {
  users: any[];
  products: any[];
  categories: any[];
  orders: any[];
  quotes: any[];
  reviews: any[];
  testimonials: any[];
  faqs: any[];
  contacts: any[];
  settings: any;
}

const defaultData: DBData = {
  users: [],
  products: [],
  categories: [],
  orders: [],
  quotes: [],
  reviews: [],
  testimonials: [],
  faqs: [],
  contacts: [],
  settings: {
    siteName: 'Classic Eco Product & Packaging',
    phone: '0163 777 888 9',
    secondaryPhone: '01637778889',
    email: 'info@classiceco.com',
    address: 'Karnophuli Garden City Shopping Complex, Shop: 3/11, 109 Kakrail, Dhaka, Bangladesh',
    facebookUrl: 'https://www.facebook.com/ClassicEcoProducts/',
    deliveryDhaka: 80,
    deliveryOutside: 150,
    freeDeliveryThreshold: 5000,
    bkashNumber: '01637778889',
    bkashType: 'Personal / Send Money or Merchant',
    nagadNumber: '01637778889',
    nagadType: 'Personal / Send Money',
    heroTitle: 'Premium Packaging That Builds Your Brand',
    heroSubtitle: 'One-stop customized restaurant packaging solution in Bangladesh. Food-grade, eco-friendly pizza boxes, burger boxes, cups, and takeaway bags with custom logo printing.',
    seoTitle: 'Classic Eco Product & Packaging - Premium Restaurant Packaging Bangladesh',
    seoDescription: 'Wholesale restaurant packaging manufacturer in Dhaka, Bangladesh. Custom pizza boxes, burger boxes, paper cups, takeaway bags.'
  }
};

// Memory cache
let memoryDB: DBData | null = null;

export function initDB(): DBData {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      memoryDB = JSON.parse(content);
      // Ensure all arrays exist
      if (!memoryDB!.users) memoryDB!.users = [];
      if (!memoryDB!.products) memoryDB!.products = [];
      if (!memoryDB!.categories) memoryDB!.categories = [];
      if (!memoryDB!.orders) memoryDB!.orders = [];
      if (!memoryDB!.quotes) memoryDB!.quotes = [];
      if (!memoryDB!.reviews) memoryDB!.reviews = [];
      if (!memoryDB!.testimonials) memoryDB!.testimonials = [];
      if (!memoryDB!.faqs) memoryDB!.faqs = [];
      if (!memoryDB!.contacts) memoryDB!.contacts = [];
      if (!memoryDB!.settings) memoryDB!.settings = { ...defaultData.settings };
    } else {
      memoryDB = { ...defaultData };
      fs.writeFileSync(DB_FILE, JSON.stringify(memoryDB, null, 2), 'utf-8');
    }
  } catch (err) {
    console.error('Error initializing persistent DB:', err);
    memoryDB = { ...defaultData };
  }
  return memoryDB!;
}

export function getDB(): DBData {
  if (!memoryDB) {
    return initDB();
  }
  return memoryDB;
}

export function saveDB(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (memoryDB) {
      fs.writeFileSync(DB_FILE, JSON.stringify(memoryDB, null, 2), 'utf-8');
    }
  } catch (err) {
    console.error('Error saving persistent DB to disk:', err);
  }
}
