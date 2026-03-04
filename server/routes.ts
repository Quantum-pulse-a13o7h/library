import type { Express, NextFunction, Request, Response } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  const asyncHandler =
    (handler: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) =>
    (req: Request, res: Response, next: NextFunction) => {
      Promise.resolve(handler(req, res, next)).catch(next);
    };
  
  // Books Routes
  app.get(api.books.list.path, asyncHandler(async (req, res) => {
    const books = await storage.getBooks();
    res.json(books);
  }));

  app.get(api.books.get.path, asyncHandler(async (req, res) => {
    const book = await storage.getBook(Number(req.params.id));
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  }));

  app.post(api.books.create.path, asyncHandler(async (req, res) => {
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
  }));

  app.put(api.books.update.path, asyncHandler(async (req, res) => {
    try {
      const input = api.books.update.input.parse(req.body);
      const book = await storage.updateBook(Number(req.params.id), input);
      res.json(book);
    } catch (err) {
      res.status(400).json({ message: 'Invalid update' });
    }
  }));

  app.delete(api.books.delete.path, asyncHandler(async (req, res) => {
    await storage.deleteBook(Number(req.params.id));
    res.status(204).send();
  }));

  // Loans Routes
  app.get(api.loans.list.path, asyncHandler(async (req, res) => {
    const loans = await storage.getLoans();
    res.json(loans);
  }));

  app.post(api.loans.create.path, asyncHandler(async (req, res) => {
    try {
      const body = req.body;
      const loanData = {
        bookId: body.bookId,
        borrowerName: body.borrowerName,
        dueDate: body.dueDate ? new Date(body.dueDate) : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      };
      const loan = await storage.createLoan(loanData as any);
      res.status(201).json(loan);
    } catch (err: any) {
      console.error("Loan creation error:", err);
      res.status(400).json({ message: err.message || 'Failed to create loan' });
    }
  }));

  app.patch(api.loans.return.path, asyncHandler(async (req, res) => {
    const loan = await storage.returnLoan(Number(req.params.id));
    if (!loan) return res.status(404).json({ message: 'Loan not found or already returned' });
    res.json(loan);
  }));

  return httpServer;
}
