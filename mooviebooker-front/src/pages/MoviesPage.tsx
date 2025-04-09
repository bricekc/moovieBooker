
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Filter } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import MovieGrid from "@/components/MovieGrid";

const MoviesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "popularity";

  // Gestionnaire pour changer le tri
  const handleSortChange = (value: string) => {
    const newParams = new URLSearchParams(searchParams);
    
    if (value) {
      newParams.set("sort", value);
    } else {
      newParams.delete("sort");
    }
    
    setSearchParams(newParams);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* En-tête de la page avec filtre */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            {searchQuery ? `Résultats pour "${searchQuery}"` : "Explorer les films"}
          </h1>
          {searchQuery && (
            <button 
              onClick={() => {
                const newParams = new URLSearchParams();
                if (sort !== "popularity") {
                  newParams.set("sort", sort);
                }
                setSearchParams(newParams);
              }}
              className="text-primary text-sm hover:underline mt-1"
            >
              Effacer la recherche
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={sort} onValueChange={handleSortChange}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popularity">Popularité</SelectItem>
              <SelectItem value="top_rated">Mieux notés</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Grille de films */}
      <MovieGrid />
    </div>
  );
};

export default MoviesPage;
