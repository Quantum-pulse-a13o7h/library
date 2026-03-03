import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, BookOpen, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBooks } from "@/hooks/use-books";
import { BookCard } from "@/components/BookCard";

export default function Home() {
  const { data: books, isLoading } = useBooks();

  // ✅ LIVE BOOK COUNT
  const bookCount = books?.length ?? 0;

  // Featured books (first 3)
  const featuredBooks = books?.slice(0, 3) || [];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-primary text-primary-foreground py-24 sm:py-32">
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2690&auto=format&fit=crop')] bg-cover bg-center" />
        </div>

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-display text-5xl sm:text-7xl font-bold mb-6 tracking-tight text-white drop-shadow-lg">
              Open Your Mind to <br /> New Worlds
            </h1>
            <p className="text-xl sm:text-2xl text-primary-foreground/90 max-w-2xl mx-auto mb-10 font-light">
              Explore our curated collection of knowledge, fiction, and history.
              Borrow seamlessly and track your reading journey.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/catalog">
                <Button size="lg" className="rounded-full text-lg px-8 py-6 bg-white text-primary hover:bg-secondary">
                  Browse Collection <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-b border-border/40">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: BookOpen, label: "Curated Books", value: bookCount.toString() },
              { icon: Users, label: "Active Readers", value: "500+" },
              { icon: Clock, label: "Open Hours", value: "24/7" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center text-center p-6"
              >
                <div className="w-12 h-12 bg-secondary/50 rounded-full flex items-center justify-center mb-4 text-primary">
                  <stat.icon className="w-6 h-6" />
                </div>
                <h3 className="text-3xl font-display font-bold text-foreground mb-1">
                  {stat.value}
                </h3>
                <p className="text-muted-foreground font-medium uppercase tracking-wide text-xs">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Books */}
      <section className="py-20 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-2">
              Featured Reads
            </h2>
            <p className="text-muted-foreground">
              Handpicked selections for this month
            </p>
          </div>
          <Link href="/catalog">
            <Button variant="ghost" className="hidden sm:flex group text-primary">
              View All <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-[400px] bg-muted animate-pulse rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}

        <div className="mt-8 text-center sm:hidden">
          <Link href="/catalog">
            <Button variant="outline" className="w-full">
              View All Books
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
