import { Link, useLocation } from "wouter";
import { Library, LayoutGrid, Settings, BookOpen } from "lucide-react";

export function Navigation() {
  const [location] = useLocation();

  const links = [
    { href: "/", label: "Home", icon: Library },
    { href: "/catalog", label: "Catalog", icon: BookOpen },
    { href: "/admin", label: "Admin", icon: Settings },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-border/40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground transform group-hover:rotate-6 transition-transform duration-300">
              <Library className="w-5 h-5" />
            </div>
            <span className="font-display font-bold text-xl text-foreground tracking-tight">
              Libri<span className="text-primary">Sys</span>
            </span>
          </Link>

          <div className="flex items-center space-x-1 sm:space-x-2">
            {links.map((link) => {
              const isActive = location === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    px-4 py-2 rounded-full flex items-center space-x-2 text-sm font-medium transition-all duration-200
                    ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }
                  `}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "" : "opacity-70"}`} />
                  <span className="hidden sm:inline">{link.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
