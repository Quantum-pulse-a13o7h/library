import { z } from 'zod';
import { insertBookSchema, insertLoanSchema, books, loans } from './schema';

export const api = {
  books: {
    list: {
      method: 'GET' as const,
      path: '/api/books',
      responses: {
        200: z.array(z.custom<typeof books.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/books/:id',
      responses: {
        200: z.custom<typeof books.$inferSelect>(),
        404: z.object({ message: z.string() }),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/books',
      input: insertBookSchema,
      responses: {
        201: z.custom<typeof books.$inferSelect>(),
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/books/:id',
      input: insertBookSchema.partial(),
      responses: {
        200: z.custom<typeof books.$inferSelect>(),
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/books/:id',
      responses: {
        204: z.void(),
      },
    },
  },
  loans: {
    list: {
      method: 'GET' as const,
      path: '/api/loans',
      responses: {
        200: z.array(z.custom<typeof loans.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/loans',
      input: insertLoanSchema.extend({
        dueDate: z.string().or(z.date())
      }),
      responses: {
        201: z.custom<typeof loans.$inferSelect>(),
        400: z.object({ message: z.string() }),
      },
    },
    return: {
      method: 'PATCH' as const,
      path: '/api/loans/:id/return',
      responses: {
        200: z.custom<typeof loans.$inferSelect>(),
      },
    },
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
