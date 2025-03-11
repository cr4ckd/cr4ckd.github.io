import { InsertUser, User, Product, InsertProduct } from "@shared/schema";
import createMemoryStore from "memorystore";
import session from "express-session";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product>;
  deleteProduct(id: number): Promise<void>;
  
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Map<number, Product>;
  private currentUserId: number;
  private currentProductId: number;
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.currentUserId = 1;
    this.currentProductId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });

    // Create default admin user
    this.createUser({
      username: "admin",
      password: "admin123",
      isAdmin: true,
    } as InsertUser);

    // Add sample products
    const sampleProducts = [
      {
        name: "Modern Leather Sofa",
        description: "Elegant leather sofa with clean lines and premium comfort",
        price: 129900, // $1,299.00
        imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800",
        category: "Sofas"
      },
      {
        name: "Minimalist Dining Table",
        description: "Sleek dining table perfect for contemporary homes",
        price: 79900, // $799.00
        imageUrl: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=800",
        category: "Tables"
      },
      {
        name: "Scandinavian Armchair",
        description: "Comfortable armchair with traditional Scandinavian design",
        price: 45900, // $459.00
        imageUrl: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800",
        category: "Chairs"
      },
      {
        name: "Modern Bed Frame",
        description: "Contemporary bed frame with built-in storage",
        price: 89900, // $899.00
        imageUrl: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800",
        category: "Beds"
      },
      {
        name: "Wooden Coffee Table",
        description: "Handcrafted wooden coffee table with natural finish",
        price: 34900, // $349.00
        imageUrl: "https://images.unsplash.com/photo-1565191999040-e67537e12ce2?w=800",
        category: "Tables"
      }
    ];

    // Initialize sample products
    sampleProducts.forEach(product => this.createProduct(product));
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    const newProduct = { ...product, id };
    this.products.set(id, newProduct);
    return newProduct;
  }

  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product> {
    const existing = await this.getProduct(id);
    if (!existing) throw new Error("Product not found");
    
    const updated = { ...existing, ...product };
    this.products.set(id, updated);
    return updated;
  }

  async deleteProduct(id: number): Promise<void> {
    this.products.delete(id);
  }
}

export const storage = new MemStorage();