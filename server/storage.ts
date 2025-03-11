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

  generateProductCode(id: number): string {
    return `RY-${String(id).padStart(4, '0')}`;
  }

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
        name: "Teak Wood Dining Table",
        description: "Handcrafted dining table made from premium Indonesian teak wood with traditional joinery techniques",
        price: 299900, // $2,999.00
        imageUrl: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=800",
        category: "Dining Tables"
      },
      {
        name: "Javanese Carved Armchair",
        description: "Intricately carved armchair showcasing traditional Javanese motifs, handmade by master craftsmen",
        price: 159900, // $1,599.00
        imageUrl: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800",
        category: "Accent Chairs"
      },
      {
        name: "Sumatra Coffee Table",
        description: "Solid wood coffee table featuring exotic Indonesian hardwood with natural grain patterns",
        price: 89900, // $899.00
        imageUrl: "https://images.unsplash.com/photo-1565191999040-e67537e12ce2?w=800",
        category: "Coffee Tables"
      },
      {
        name: "Balinese Storage Cabinet",
        description: "Traditional storage cabinet with hand-carved Balinese patterns and premium hardware",
        price: 239900, // $2,399.00
        imageUrl: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800",
        category: "Cabinets & Cupboards"
      },
      {
        name: "Indonesian Teak Bed Frame",
        description: "King-size bed frame crafted from sustainable Indonesian teak with traditional woodworking techniques",
        price: 399900, // $3,999.00
        imageUrl: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800",
        category: "Beds"
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
    const productCode = this.generateProductCode(id);
    const newProduct = { ...product, id, productCode };
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