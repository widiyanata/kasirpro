import { openDB, type DBSchema } from 'idb';

// Define the database schema
interface KasirKilatDB extends DBSchema {
  products: {
    key: number;
    value: {
      id: number;
      name: string;
      price: number;
      stock: number;
      createdAt: Date;
      updatedAt: Date;
    };
    indexes: { 'by-name': string };
  };
  sales: {
    key: number;
    value: {
      id: number;
      date: string; // Store date as ISO string
      items: Array<{
        productId: number;
        productName: string;
        quantity: number;
        price: number;
      }>;
      total: number;
      paymentMethod: string;
      notes: string;
    };
    indexes: { 'by-date': string };
  };
}

// Database version
const DB_VERSION = 1;
const DB_NAME = 'kasir-kilat-db';

// Initialize the database
export const initDB = async () => {
  const db = await openDB<KasirKilatDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Create products store
      const productStore = db.createObjectStore('products', {
        keyPath: 'id',
        autoIncrement: true,
      });
      productStore.createIndex('by-name', 'name');

      // Create sales store
      const salesStore = db.createObjectStore('sales', {
        keyPath: 'id',
        autoIncrement: true,
      });
      salesStore.createIndex('by-date', 'date');
    },
  });

  return db;
};

// Get database instance
let dbPromise: Promise<any> | null = null;

export const getDB = () => {
  if (!dbPromise) {
    dbPromise = initDB();
  }
  return dbPromise;
};

// Product operations
export const productService = {
  async getAll() {
    const db = await getDB();
    return db.getAll('products');
  },

  async getById(id: number) {
    const db = await getDB();
    return db.get('products', id);
  },

  async add(product: Omit<KasirKilatDB['products']['value'], 'id' | 'createdAt' | 'updatedAt'>) {
    const db = await getDB();
    const now = new Date();
    return db.add('products', {
      ...product,
      createdAt: now,
      updatedAt: now,
    });
  },

  async update(id: number, product: Partial<Omit<KasirKilatDB['products']['value'], 'id' | 'createdAt' | 'updatedAt'>>) {
    const db = await getDB();
    const existingProduct = await db.get('products', id);
    if (!existingProduct) {
      throw new Error('Product not found');
    }

    return db.put('products', {
      ...existingProduct,
      ...product,
      updatedAt: new Date(),
    });
  },

  async delete(id: number) {
    const db = await getDB();
    return db.delete('products', id);
  },
};

// Sales operations
export const salesService = {
  async getAll() {
    const db = await getDB();
    return db.getAll('sales');
  },

  async getById(id: number) {
    const db = await getDB();
    return db.get('sales', id);
  },

  async add(sale: Omit<KasirKilatDB['sales']['value'], 'id'>) {
    const db = await getDB();
    return db.add('sales', sale);
  },

  async delete(id: number) {
    const db = await getDB();
    return db.delete('sales', id);
  },
};
