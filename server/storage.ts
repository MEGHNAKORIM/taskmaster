import { 
  users, 
  type User, 
  type InsertUser,
  projectItems,
  type ProjectItem,
  type InsertProjectItem,
  otherCosts,
  type OtherCost,
  type InsertOtherCost
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Project items operations
  getProjectItems(userId: number): Promise<ProjectItem[]>;
  getProjectItem(id: number): Promise<ProjectItem | undefined>;
  createProjectItem(item: InsertProjectItem): Promise<ProjectItem>;
  updateProjectItem(id: number, item: Partial<InsertProjectItem>): Promise<ProjectItem | undefined>;
  deleteProjectItem(id: number): Promise<boolean>;
  
  // Other costs operations
  getOtherCosts(userId: number): Promise<OtherCost[]>;
  getOtherCost(id: number): Promise<OtherCost | undefined>;
  createOtherCost(cost: InsertOtherCost): Promise<OtherCost>;
  updateOtherCost(id: number, cost: Partial<InsertOtherCost>): Promise<OtherCost | undefined>;
  deleteOtherCost(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private items: Map<number, ProjectItem>;
  private costs: Map<number, OtherCost>;
  private currentUserId: number;
  private currentItemId: number;
  private currentCostId: number;

  constructor() {
    this.users = new Map();
    this.items = new Map();
    this.costs = new Map();
    this.currentUserId = 1;
    this.currentItemId = 1;
    this.currentCostId = 1;
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.firebaseUid === firebaseUid,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Project items operations
  async getProjectItems(userId: number): Promise<ProjectItem[]> {
    return Array.from(this.items.values()).filter(
      (item) => item.userId === userId,
    );
  }

  async getProjectItem(id: number): Promise<ProjectItem | undefined> {
    return this.items.get(id);
  }

  async createProjectItem(item: InsertProjectItem): Promise<ProjectItem> {
    const id = this.currentItemId++;
    const createdAt = new Date();
    const projectItem: ProjectItem = { ...item, id, createdAt };
    this.items.set(id, projectItem);
    return projectItem;
  }

  async updateProjectItem(id: number, update: Partial<InsertProjectItem>): Promise<ProjectItem | undefined> {
    const item = this.items.get(id);
    if (!item) return undefined;
    
    const updatedItem: ProjectItem = { ...item, ...update };
    this.items.set(id, updatedItem);
    return updatedItem;
  }

  async deleteProjectItem(id: number): Promise<boolean> {
    return this.items.delete(id);
  }

  // Other costs operations
  async getOtherCosts(userId: number): Promise<OtherCost[]> {
    return Array.from(this.costs.values()).filter(
      (cost) => cost.userId === userId,
    );
  }

  async getOtherCost(id: number): Promise<OtherCost | undefined> {
    return this.costs.get(id);
  }

  async createOtherCost(cost: InsertOtherCost): Promise<OtherCost> {
    const id = this.currentCostId++;
    const createdAt = new Date();
    const otherCost: OtherCost = { ...cost, id, createdAt };
    this.costs.set(id, otherCost);
    return otherCost;
  }

  async updateOtherCost(id: number, update: Partial<InsertOtherCost>): Promise<OtherCost | undefined> {
    const cost = this.costs.get(id);
    if (!cost) return undefined;
    
    const updatedCost: OtherCost = { ...cost, ...update };
    this.costs.set(id, updatedCost);
    return updatedCost;
  }

  async deleteOtherCost(id: number): Promise<boolean> {
    return this.costs.delete(id);
  }
}

export const storage = new MemStorage();
