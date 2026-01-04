import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const books = pgTable("books", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  author: text("author").notNull(),
  isbn: text("isbn").notNull(),
  coverUrl: text("cover_url").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  totalQuantity: integer("total_quantity").notNull().default(1),
  availableQuantity: integer("available_quantity").notNull().default(1),
});

export const loans = pgTable("loans", {
  id: serial("id").primaryKey(),
  bookId: integer("book_id").notNull(),
  borrowerName: text("borrower_name").notNull(),
  loanDate: timestamp("loan_date").defaultNow(),
  returnedDate: timestamp("returned_date"),
  status: text("status").notNull().default("active"), // active, returned
});

export const insertBookSchema = createInsertSchema(books).omit({ id: true });
export const insertLoanSchema = createInsertSchema(loans).omit({ id: true, loanDate: true, returnedDate: true, status: true });

export type Book = typeof books.$inferSelect;
export type InsertBook = z.infer<typeof insertBookSchema>;
export type Loan = typeof loans.$inferSelect;
export type InsertLoan = z.infer<typeof insertLoanSchema>;
