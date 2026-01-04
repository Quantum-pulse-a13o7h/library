import { db } from "./db";
import {
  books,
  loans,
  type Book,
  type InsertBook,
  type Loan,
  type InsertLoan
} from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Books
  getBooks(): Promise<Book[]>;
  getBook(id: number): Promise<Book | undefined>;
  createBook(book: InsertBook): Promise<Book>;
  updateBook(id: number, book: Partial<InsertBook>): Promise<Book>;
  deleteBook(id: number): Promise<void>;
  
  // Loans
  getLoans(): Promise<Loan[]>;
  createLoan(loan: InsertLoan): Promise<Loan>;
  returnLoan(id: number): Promise<Loan | undefined>;
}

export class DatabaseStorage implements IStorage {
  // Books Implementation
  async getBooks(): Promise<Book[]> {
    return await db.select().from(books);
  }

  async getBook(id: number): Promise<Book | undefined> {
    const [book] = await db.select().from(books).where(eq(books.id, id));
    return book;
  }

  async createBook(insertBook: InsertBook): Promise<Book> {
    const [book] = await db.insert(books).values(insertBook).returning();
    return book;
  }

  async updateBook(id: number, updates: Partial<InsertBook>): Promise<Book> {
    const [updated] = await db.update(books)
      .set(updates)
      .where(eq(books.id, id))
      .returning();
    return updated;
  }

  async deleteBook(id: number): Promise<void> {
    await db.delete(books).where(eq(books.id, id));
  }

  // Loans Implementation
  async getLoans(): Promise<Loan[]> {
    return await db.select().from(loans);
  }

  async createLoan(insertLoan: InsertLoan): Promise<Loan> {
    return await db.transaction(async (tx) => {
      const [book] = await tx.select().from(books).where(eq(books.id, insertLoan.bookId));
      if (!book) {
        throw new Error("Book not found");
      }
      
      if (book.availableQuantity < 1) {
        throw new Error("Book not available");
      }

      await tx.update(books)
        .set({ availableQuantity: book.availableQuantity - 1 })
        .where(eq(books.id, insertLoan.bookId));

      const [loan] = await tx.insert(loans).values({
        ...insertLoan,
        dueDate: new Date(insertLoan.dueDate)
      }).returning();
      return loan;
    });
  }

  async returnLoan(id: number): Promise<Loan | undefined> {
    return await db.transaction(async (tx) => {
      const [loan] = await tx.select().from(loans).where(eq(loans.id, id));
      if (!loan || loan.status === 'returned') return undefined;

      const [updatedLoan] = await tx.update(loans)
        .set({ 
          status: 'returned',
          returnedDate: new Date()
        })
        .where(eq(loans.id, id))
        .returning();

      const [book] = await tx.select().from(books).where(eq(books.id, loan.bookId));
      if (book) {
        await tx.update(books)
          .set({ availableQuantity: book.availableQuantity + 1 })
          .where(eq(books.id, loan.bookId));
      }

      return updatedLoan;
    });
  }
}

export const storage = new DatabaseStorage();
