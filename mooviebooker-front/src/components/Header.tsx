
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Film, Menu, Search, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { set } from "date-fns";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { user, logout } = useAuth();
    

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/movies?search=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-card/70 to-card/60 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <Film className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl hidden sm:block">MoovieBooker</span>
        </Link>

        {/* Search (Desktop) */}
        <div className="hidden md:block flex-1 max-w-md mx-4">
          <form onSubmit={handleSearch} className="relative">
            <Input
              type="text"
              placeholder="Rechercher un film..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          </form>
        </div>

        {/* Navigation (Desktop) */}
        <nav className="hidden md:flex items-center gap-4">
          <Link to="/movies" className="text-foreground/80 hover:text-foreground">
            Films
          </Link>
          {user ? (
            <>
              <Link to="/reservations" className="text-foreground/80 hover:text-foreground">
                Mes Réservations
              </Link>
              <div className="flex items-center gap-2 ml-4">
                <div className="text-sm text-muted-foreground">
                  {user?.firstName}
                </div>
                <Button variant="ghost" size="icon" onClick={logout} title="Se déconnecter">
                  <User className="h-5 w-5" />
                </Button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline">Connexion</Button>
              </Link>
              <Link to="/register">
                <Button>Inscription</Button>
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Menu Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* Mobile Menu & Search */}
      {isMenuOpen && (
        <div className="md:hidden py-4 px-4 bg-card border-t border-border">
          {/* Search (Mobile) */}
          <form onSubmit={handleSearch} className="mb-4 relative">
            <Input
              type="text"
              placeholder="Rechercher un film..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          </form>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-2">
            <Link
              to="/movies"
              className="p-2 hover:bg-muted rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Films
            </Link>
            {user?.email ? (
              <>
                <Link
                  to="/reservations"
                  className="p-2 hover:bg-muted rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Mes Réservations
                </Link>
                <div className="border-t border-border my-2 pt-2 flex justify-between items-center">
                  <span className="text-muted-foreground">{user?.firstName} {user?.lastName}</span>
                  <Button variant="outline" size="sm" onClick={logout}>
                    Se déconnecter
                  </Button>
                </div>
              </>
            ) : (
              <div className="border-t border-border mt-2 pt-2 flex flex-col gap-2">
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full">Connexion</Button>
                </Link>
                <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full">Inscription</Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
