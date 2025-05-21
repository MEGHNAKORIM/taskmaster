import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertUserSchema, 
  insertProjectItemSchema, 
  insertOtherCostSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.post("/api/users", async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create user" });
      }
    }
  });

  app.get("/api/users/firebase/:firebaseUid", async (req: Request, res: Response) => {
    try {
      const { firebaseUid } = req.params;
      const user = await storage.getUserByFirebaseUid(firebaseUid);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  // Project items routes
  app.get("/api/items/:userId", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const items = await storage.getProjectItems(userId);
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch items" });
    }
  });

  app.post("/api/items", async (req: Request, res: Response) => {
    try {
      const itemData = insertProjectItemSchema.parse(req.body);
      const item = await storage.createProjectItem(itemData);
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create item" });
      }
    }
  });

  app.put("/api/items/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = insertProjectItemSchema.partial().parse(req.body);
      
      const updatedItem = await storage.updateProjectItem(id, updateData);
      
      if (!updatedItem) {
        return res.status(404).json({ message: "Item not found" });
      }
      
      res.json(updatedItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update item" });
      }
    }
  });

  app.delete("/api/items/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteProjectItem(id);
      
      if (!success) {
        return res.status(404).json({ message: "Item not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete item" });
    }
  });

  // Other costs routes
  app.get("/api/costs/:userId", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const costs = await storage.getOtherCosts(userId);
      res.json(costs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch costs" });
    }
  });

  app.post("/api/costs", async (req: Request, res: Response) => {
    try {
      const costData = insertOtherCostSchema.parse(req.body);
      const cost = await storage.createOtherCost(costData);
      res.status(201).json(cost);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create cost" });
      }
    }
  });

  app.put("/api/costs/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = insertOtherCostSchema.partial().parse(req.body);
      
      const updatedCost = await storage.updateOtherCost(id, updateData);
      
      if (!updatedCost) {
        return res.status(404).json({ message: "Cost not found" });
      }
      
      res.json(updatedCost);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update cost" });
      }
    }
  });

  app.delete("/api/costs/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteOtherCost(id);
      
      if (!success) {
        return res.status(404).json({ message: "Cost not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete cost" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
