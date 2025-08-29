"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Search } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { IProduct } from "@/models/Product";

interface SearchResult {
  _id: string;
  genericName: string;
  discountPrice: number;
  originalPrice: number;
  category: string;
  subCategory: string;
  images: string[];
  discount?: number;
  rating?: number;
  reviews: { rating: number; comment: string; user: string }[];
}

export default function SearchDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    // Load recent searches from localStorage
    const savedSearches = localStorage.getItem("recentSearches");
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim().length > 2) {
        setIsLoading(true);
        // Fetch results from API
        fetch(`/api/product/search?q=${encodeURIComponent(query)}`)
          .then((res) => {
            if (!res.ok) throw new Error("Failed to fetch search results");
            return res.json();
          })
          .then(({ products }: { products: IProduct[] }) => {
            const mappedResults: SearchResult[] = products.map((product) => ({
              _id: product._id,
              genericName: product.genericName,
              discountPrice: product.discountPrice,
              originalPrice: product.originalPrice,
              category: product.category,
              subCategory: product.subCategory,
              images: product.images,
              discount: product.originalPrice
                ? Math.round(
                    ((product.originalPrice - product.discountPrice) / product.originalPrice) * 100
                  )
                : undefined,
              rating: product.reviews.length
                ? Math.round(
                    product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
                  )
                : undefined,
              reviews: product.reviews,
            }));
            setResults(mappedResults);
            setIsLoading(false);
          })
          .catch((error) => {
            console.error("Error fetching search results:", error);
            setResults([]);
            setIsLoading(false);
          });
      } else {
        setResults([]);
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSearch = (searchQuery: string) => {
    // Save to recent searches
    const updatedSearches = [searchQuery, ...recentSearches.filter((s) => s !== searchQuery)].slice(
      0,
      5
    );
    setRecentSearches(updatedSearches);
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));

    // Navigate to search results page
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    setOpen(false);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  // Prevent default close behavior (click outside, Esc)
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      // Only allow closing via explicit setOpen(false)
      return;
    }
    setOpen(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Search className="h-5 w-5" />
          <span className="sr-only">Search</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogTitle className="sr-only">Search Products</DialogTitle>
        <div className="flex items-center border-b pb-4">
          <Search className="mr-2 h-5 w-5 flex-shrink-0 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search for products..."
            className="flex-1 border-0 shadow-none focus-visible:ring-0"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && query.trim()) {
                handleSearch(query.trim());
              }
            }}
          />
          {/* {query && (
            <Button variant="ghost" size="icon" onClick={() => setQuery("")} className="h-8 w-8">
              <X className="h-4 w-4" />
              <span className="sr-only">Clear</span>
            </Button>
          )} */}
        </div>

        <div className="mt-4 max-h-[300px] overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-4">
              {results.map((result) => (
                <div
                  key={result._id}
                  className="flex items-center gap-4 cursor-pointer hover:bg-muted p-2 rounded-md"
                  onClick={() => router.push(`/product/${result._id}`)}
                >
                  <Image
                    src={result.images[0] || "/placeholder.svg"}
                    alt={result.genericName}
                    className="h-16 w-16 object-cover rounded-md"
                    width={64}
                    height={64}
                  />
                  <div className="flex-1">
                    <h4 className="font-medium line-clamp-1">{result.genericName}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-bold">₹{result.discountPrice}</span>
                      <span className="text-sm text-muted-foreground line-through">
                        ₹{result.originalPrice}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {result.category}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {result.subCategory}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : query.trim().length > 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No results found for &ldquo;{query}&ldquo;</p>
            </div>
          ) : (
            <div>
              {recentSearches.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">Recent Searches</h3>
                    <Button variant="ghost" size="sm" onClick={clearRecentSearches}>
                      Clear
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((search, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="cursor-pointer hover:bg-muted"
                        onClick={() => handleSearch(search)}
                      >
                        {search}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <h3 className="font-medium mb-2">Popular Categories</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => router.push("/collections/electronics")}
                  >
                    Electronics
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => router.push("/collections/books-stationery")}
                  >
                    Books & Stationery
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => router.push("/collections/software-subscriptions")}
                  >
                    Software
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => router.push("/collections/fashion")}
                  >
                    Fashion
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}