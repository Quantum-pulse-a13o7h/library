import { useLoans, useReturnLoan } from "@/hooks/use-loans";
import { CreateBookDialog } from "@/components/CreateBookDialog";
import { format } from "date-fns";
import { Loader2, CheckCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useBooks } from "@/hooks/use-books";

export default function Admin() {
  const { data: loans, isLoading: loansLoading } = useLoans();
  const { data: books } = useBooks();
  const returnLoan = useReturnLoan();

  // Helper to find book title by ID
  const getBookTitle = (id: number) => books?.find(b => b.id === id)?.title || "Unknown Book";

  // Filter only active loans for the main view
  const activeLoans = loans?.filter(l => l.status === 'active') || [];
  const returnedLoans = loans?.filter(l => l.status === 'returned') || [];

  const isOverdue = (dueDate: string | Date) => {
    return new Date(dueDate) < new Date() && new Date(dueDate).getTime() > 0;
  };

  return (
    <div className="min-h-screen bg-background py-12 container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-display font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage library inventory and track loans</p>
        </div>
        <CreateBookDialog />
      </div>

      <div className="grid gap-8">
        {/* Active Loans Panel */}
        <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border bg-muted/20">
            <h2 className="text-xl font-bold font-display flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-primary" /> Active Loans
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Borrower</TableHead>
                  <TableHead>Book Title</TableHead>
                  <TableHead>Date Borrowed</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loansLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
                    </TableCell>
                  </TableRow>
                ) : activeLoans.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                      No active loans. All books are in the library.
                    </TableCell>
                  </TableRow>
                ) : (
                  activeLoans.map((loan) => (
                    <TableRow key={loan.id} className={isOverdue(loan.dueDate) ? "bg-red-50/50" : ""}>
                      <TableCell className="font-medium">{loan.borrowerName}</TableCell>
                      <TableCell>{getBookTitle(loan.bookId)}</TableCell>
                      <TableCell>
                        {loan.loanDate ? format(new Date(loan.loanDate), "MMM d, yyyy") : "-"}
                      </TableCell>
                      <TableCell className={isOverdue(loan.dueDate) ? "text-destructive font-bold" : ""}>
                        {loan.dueDate ? format(new Date(loan.dueDate), "MMM d, yyyy") : "-"}
                      </TableCell>
                      <TableCell>
                        {isOverdue(loan.dueDate) ? (
                          <Badge variant="destructive" className="animate-pulse">Overdue</Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200">
                            Borrowed
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant={isOverdue(loan.dueDate) ? "destructive" : "outline"}
                          onClick={() => returnLoan.mutate(loan.id)}
                          disabled={returnLoan.isPending}
                          className="transition-colors"
                        >
                          {returnLoan.isPending ? "..." : "Return Book"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Recent Returns (History) */}
        <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden opacity-80 hover:opacity-100 transition-opacity">
          <div className="p-6 border-b border-border bg-muted/20">
            <h2 className="text-lg font-bold font-display flex items-center gap-2 text-muted-foreground">
              <CheckCircle className="w-5 h-5" /> Recent Returns History
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Borrower</TableHead>
                  <TableHead>Book Title</TableHead>
                  <TableHead>Date Returned</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {returnedLoans.slice(0, 5).map((loan) => (
                  <TableRow key={loan.id}>
                    <TableCell className="text-muted-foreground">{loan.borrowerName}</TableCell>
                    <TableCell className="text-muted-foreground">{getBookTitle(loan.bookId)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {loan.returnedDate ? format(new Date(loan.returnedDate), "MMM d, yyyy") : "-"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50">
                        Returned
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {returnedLoans.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="h-16 text-center text-muted-foreground text-sm">
                      No history yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
