import { type Book } from "@shared/schema";
import { motion } from "framer-motion";
import { Book as BookIcon, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateLoan } from "@/hooks/use-loans";
import { useDeleteBook } from "@/hooks/use-books";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { addDays } from "date-fns";

interface BookCardProps {
  book: Book;
}

const borrowSchema = z.object({
  borrowerName: z.string().min(2, "Name is required"),
});

export function BookCard({ book }: BookCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const createLoan = useCreateLoan();
  const deleteBook = useDeleteBook();

  const form = useForm<z.infer<typeof borrowSchema>>({
    resolver: zodResolver(borrowSchema),
    defaultValues: {
      borrowerName: "",
    },
  });

  const onSubmit = (data: z.infer<typeof borrowSchema>) => {
    const dueDate = addDays(new Date(), 14);

    createLoan.mutate(
      {
        bookId: book.id,
        borrowerName: data.borrowerName,
        dueDate: dueDate as any,
      },
      {
        onSuccess: () => {
          setIsOpen(false);
          toast({
            title: "Success",
            description: `You have borrowed ${book.title}`,
          });
          form.reset();
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        },
      }
    );
  };

  const isAvailable = book.availableQuantity > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="group bg-card rounded-xl border border-border/50 overflow-hidden shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 flex flex-col h-full"
    >
      {/* COVER */}
      <div className="relative aspect-[2/3] overflow-hidden bg-muted">
        {book.coverUrl ? (
          <img
            src={book.coverUrl}
            alt={book.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground p-4 text-center">
            <BookIcon className="w-12 h-12 mb-2 opacity-20" />
            <span className="text-sm">No Cover</span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <p className="text-white text-sm line-clamp-3">
            {book.description}
          </p>
        </div>

        <div className="absolute top-2 right-2">
          {isAvailable ? (
            <span className="bg-emerald-500/90 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> Available
            </span>
          ) : (
            <span className="bg-rose-500/90 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
              <XCircle className="w-3 h-3" /> Out of Stock
            </span>
          )}
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-5 flex flex-col h-full">
        <div className="mb-auto">
          <p className="text-xs font-semibold tracking-wider text-primary mb-1 uppercase">
            {book.category}
          </p>
          <h3 className="text-lg font-bold mb-1">{book.title}</h3>
          <p className="text-sm text-muted-foreground mb-3">
            by {book.author}
          </p>
        </div>

        {/* FOOTER */}
        <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between gap-2">
          <div className="text-xs text-muted-foreground flex flex-col">
            <span className="font-medium">
              {book.availableQuantity} of {book.totalQuantity} left
            </span>
            <span>ISBN: {book.isbn}</span>
          </div>

          <div className="flex gap-2">
            {/* DELETE */}
            <Button
              variant="destructive"
              size="sm"
              onClick={() => deleteBook.mutate(book.id)}
              disabled={deleteBook.isPending}
            >
              Delete
            </Button>

            {/* BORROW */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button
                  disabled={!isAvailable}
                  size="sm"
                  className="rounded-full px-5"
                >
                  Borrow
                </Button>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    Borrow "{book.title}"
                  </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4 py-4"
                  >
                    <FormField
                      control={form.control}
                      name="borrowerName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Borrower Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end gap-2 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={createLoan.isPending}
                      >
                        {createLoan.isPending
                          ? "Confirming..."
                          : "Confirm Loan"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
