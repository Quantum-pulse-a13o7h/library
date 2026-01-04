import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Books Routes
  app.get(api.books.list.path, async (req, res) => {
    const books = await storage.getBooks();
    res.json(books);
  });

  app.get(api.books.get.path, async (req, res) => {
    const book = await storage.getBook(Number(req.params.id));
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  });

  app.post(api.books.create.path, async (req, res) => {
    try {
      const input = api.books.create.input.parse(req.body);
      const book = await storage.createBook(input);
      res.status(201).json(book);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.put(api.books.update.path, async (req, res) => {
    try {
      const input = api.books.update.input.parse(req.body);
      const book = await storage.updateBook(Number(req.params.id), input);
      res.json(book);
    } catch (err) {
      res.status(400).json({ message: 'Invalid update' });
    }
  });

  app.delete(api.books.delete.path, async (req, res) => {
    await storage.deleteBook(Number(req.params.id));
    res.status(204).send();
  });

  // Loans Routes
  app.get(api.loans.list.path, async (req, res) => {
    const loans = await storage.getLoans();
    res.json(loans);
  });

  app.post(api.loans.create.path, async (req, res) => {
    try {
      const input = api.loans.create.input.parse(req.body);
      const loan = await storage.createLoan(input);
      res.status(201).json(loan);
    } catch (err: any) {
      res.status(400).json({ message: err.message || 'Failed to create loan' });
    }
  });

  app.patch(api.loans.return.path, async (req, res) => {
    const loan = await storage.returnLoan(Number(req.params.id));
    if (!loan) return res.status(404).json({ message: 'Loan not found or already returned' });
    res.json(loan);
  });

  return httpServer;
}

// Seed function to be called from index.ts if needed, 
// or we can just let the user add books via UI. 
// Ideally we run this once.
export async function seedDatabase() {
  const books = await storage.getBooks();
  if (books.length === 0) {
    await storage.createBook({
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      isbn: "978-0743273565",
      coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800",
      category: "Fiction",
      description: "A novel set in the Jazz Age that explores themes of wealth, love, and the American Dream.",
      totalQuantity: 5,
      availableQuantity: 5
    });
    await storage.createBook({
      title: "A Brief History of Time",
      author: "Stephen Hawking",
      isbn: "978-0553380163",
      coverUrl: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=800",
      category: "Science",
      description: "A landmark volume in science writing by one of the great minds of our time.",
      totalQuantity: 3,
      availableQuantity: 3
    });
    await storage.createBook({
      title: "Clean Code",
      author: "Robert C. Martin",
      isbn: "978-0132350884",
      coverUrl: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=800",
      category: "Technology",
      description: "A Handbook of Agile Software Craftsmanship.",
      totalQuantity: 10,
      availableQuantity: 10
    });
    console.log("Database seeded!");
  }
}
