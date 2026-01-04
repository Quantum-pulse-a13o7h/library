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
      const body = req.body;
      const input = api.loans.create.input.parse({
        ...body,
        dueDate: new Date(body.dueDate)
      });
      const loan = await storage.createLoan(input as any);
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
