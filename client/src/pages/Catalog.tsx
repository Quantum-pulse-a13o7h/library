import { useState } from "react";
import { useBooks } from "@/hooks/use-books";
import { BookCard } from "@/components/BookCard";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Catalog() {
  const { data: books, isLoading } = useBooks();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Derive unique categories
  const categories = Array.from(new Set(books?.map(b => b.category) || [])).sort();

  // Filter books
  const filteredBooks = books?.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(search.toLowerCase()) || 
                          book.author.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory ? book.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background py-12 container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-display font-bold text-foreground">Library Catalog</h1>
          <p className="text-muted-foreground mt-2">Explore our complete collection of {books?.length || 0} books</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="w-full lg:w-64 space-y-6 flex-shrink-0">
          <div className="bg-white p-6 rounded-xl border border-border/60 shadow-sm">
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input 
                placeholder="Search title or author..." 
                className="pl-9 bg-secondary/30 border-transparent focus:bg-white transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <div>
              <h3 className="font-display font-bold text-lg mb-3 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" /> Categories
              </h3>
              <div className="space-y-2">
                <Button
                  variant={selectedCategory === null ? "default" : "ghost"}
                  className="w-full justify-start font-normal"
                  onClick={() => setSelectedCategory(null)}
                >
                  All Categories
                </Button>
                {categories.map(cat => (
                  <Button
                    key={cat}
                    variant={selectedCategory === cat ? "default" : "ghost"}
                    className="w-full justify-start font-normal truncate"
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Books Grid */}
        <div className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="h-[400px] bg-muted animate-pulse rounded-xl" />
              ))}
            </div>
          ) : filteredBooks && filteredBooks.length > 0 ? (
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-20 bg-muted/30 rounded-2xl border border-dashed border-border">
              <h3 className="text-xl font-bold text-muted-foreground">No books found</h3>
              <p className="text-muted-foreground mt-2">Try adjusting your search or filters.</p>
              <Button 
                variant="link" 
                onClick={() => { setSearch(""); setSelectedCategory(null); }}
                className="mt-4 text-primary"
              >
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
