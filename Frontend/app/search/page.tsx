import { Suspense } from "react";
import Link from "next/link";
import { ChevronRight, Filter } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ProductCard from "@/components/product-card";

// Mock data for filters
const filters = {
  brands: [
    { id: "brand-1", name: "TechPro" },
    { id: "brand-2", name: "SoundMaster" },
    { id: "brand-3", name: "UltraGear" },
    { id: "brand-4", name: "SmartLife" },
    { id: "brand-5", name: "DigiTech" },
  ],
  priceRanges: [
    { id: "price-1", name: "Under ₹1,000" },
    { id: "price-2", name: "₹1,000 - ₹5,000" },
    { id: "price-3", name: "₹5,000 - ₹10,000" },
    { id: "price-4", name: "₹10,000 - ₹20,000" },
    { id: "price-5", name: "Above ₹20,000" },
  ],
  discounts: [
    { id: "discount-1", name: "10% or more" },
    { id: "discount-2", name: "25% or more" },
    { id: "discount-3", name: "50% or more" },
    { id: "discount-4", name: "60% or more" },
    { id: "discount-5", name: "75% or more" },
  ],
  ratings: [
    { id: "rating-4", name: "4★ & above" },
    { id: "rating-3", name: "3★ & above" },
    { id: "rating-2", name: "2★ & above" },
    { id: "rating-1", name: "1★ & above" },
  ],
};

// Mock product data
const mockProducts = [
  {
    id: "prod_1",
    name: "Noise-Cancelling Headphones",
    price: 2999,
    originalPrice: 3999,
    images: [
      "https://placehold.co/300x300/png",
      "https://placehold.co/400x400/png",
      "https://placehold.co/400x400/png",
      "https://placehold.co/400x400/png",
    ],
    discount: 25,
    rating: 4.5,
    reviews: 120,
    category: "Audio",
  },
  {
    id: "prod_2",
    name: "Wireless Earbuds",
    price: 1999,
    originalPrice: 2499,
    images: [
      "https://placehold.co/300x300/png",
      "https://placehold.co/400x400/png",
      "https://placehold.co/400x400/png",
      "https://placehold.co/400x400/png",
    ],
    discount: 20,
    rating: 4.0,
    reviews: 80,
    category: "Audio",
  },
  {
    id: "prod_3",
    name: "Bluetooth Speaker",
    price: 3999,
    originalPrice: 4999,
    images: [
      "https://placehold.co/300x300/png",
      "https://placehold.co/400x400/png",
      "https://placehold.co/400x400/png",
      "https://placehold.co/400x400/png",
    ],
    discount: 20,
    rating: 4.2,
    reviews: 95,
    category: "Audio",
  },
];

async function SearchResults({
  query,
  category,
  minPrice,
  maxPrice,
}: {
  query: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
}) {
  // Mock filtering logic based on query, category, minPrice, maxPrice
  let products = mockProducts;

  if (query) {
    products = products.filter((product) =>
      product.name.toLowerCase().includes(query.toLowerCase())
    );
  }
  if (category) {
    products = products.filter((product) => product.category === category);
  }
  if (minPrice) {
    const min = Number.parseFloat(minPrice);
    products = products.filter((product) => product.price >= min);
  }
  if (maxPrice) {
    const max = Number.parseFloat(maxPrice);
    products = products.filter((product) => product.price <= max);
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-2">No results found</h2>
        <p className="text-muted-foreground mb-6">
          We couldn&apos;t find any products matching your search for &quot;{query}&quot;
        </p>
        <Button asChild>
          <Link href="/collections">Browse Collections</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={{
            id: Number.parseInt(product.id.replace("prod_", "")),
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice,
            image: product.images[0],
            discount: product.discount,
            rating: product.rating,
            reviews: product.reviews,
            href: `/product/${product.id}`,
          }}
        />
      ))}
    </div>
  );
}

function SearchResultsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="border rounded-lg overflow-hidden">
          <Skeleton className="h-[200px] w-full" />
          <div className="p-4 space-y-3">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-8 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Define the props type
type Props = {
  searchParams: Promise<{
    q?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
  }>;
};

export default async function SearchPage({ searchParams }: Props) {
  const { q = "", category, minPrice, maxPrice } = await searchParams; // Unwrap the Promise

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto py-6 px-4">
          <div className="flex items-center text-sm mb-6">
            <Link href="/" className="text-muted-foreground hover:text-foreground">
              Home
            </Link>
            <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />
            <Link href="/collections" className="text-muted-foreground hover:text-foreground">
              Collections
            </Link>
            <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />
            <span className="font-medium">Search Results</span>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Filters - Desktop */}
            <div className="hidden md:block w-64 flex-shrink-0">
              <div className="sticky top-20">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-lg">Filters</h2>
                  <Button variant="ghost" size="sm" className="h-8 text-primary">
                    Clear All
                  </Button>
                </div>

                <div className="space-y-4">
                  <Accordion
                    type="multiple"
                    defaultValue={["brands", "price", "discount", "rating"]}
                  >
                    <AccordionItem value="brands">
                      <AccordionTrigger className="py-2">Brands</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          {filters.brands.map((brand) => (
                            <div key={brand.id} className="flex items-center space-x-2">
                              <Checkbox id={brand.id} />
                              <label
                                htmlFor={brand.id}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {brand.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="price">
                      <AccordionTrigger className="py-2">Price Range</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          {filters.priceRanges.map((price) => (
                            <div key={price.id} className="flex items-center space-x-2">
                              <Checkbox id={price.id} />
                              <label
                                htmlFor={price.id}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {price.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="discount">
                      <AccordionTrigger className="py-2">Discount</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          {filters.discounts.map((discount) => (
                            <div key={discount.id} className="flex items-center space-x-2">
                              <Checkbox id={discount.id} />
                              <label
                                htmlFor={discount.id}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {discount.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="rating">
                      <AccordionTrigger className="py-2">Customer Rating</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          {filters.ratings.map((rating) => (
                            <div key={rating.id} className="flex items-center space-x-2">
                              <Checkbox id={rating.id} />
                              <label
                                htmlFor={rating.id}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {rating.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </div>
            </div>

            {/* Main content */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-2xl font-bold">Search Results for &quot;{q}&quot;</h1>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="md:hidden">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground hidden sm:inline">Sort by:</span>
                    <Select defaultValue="relevance">
                      <SelectTrigger className="w-[180px] h-9">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="relevance">Relevance</SelectItem>
                        <SelectItem value="price-low">Price: Low to High</SelectItem>
                        <SelectItem value="price-high">Price: High to Low</SelectItem>
                        <SelectItem value="discount">Discount</SelectItem>
                        <SelectItem value="newest">Newest First</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Applied filters */}
              {(category || minPrice || maxPrice) && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {category && (
                    <Badge variant="outline" className="rounded-full px-3 py-1">
                      Category: {category}
                      <button className="ml-1 text-muted-foreground hover:text-foreground">×</button>
                    </Badge>
                  )}
                  {minPrice && (
                    <Badge variant="outline" className="rounded-full px-3 py-1">
                      Min Price: ₹{minPrice}
                      <button className="ml-1 text-muted-foreground hover:text-foreground">×</button>
                    </Badge>
                  )}
                  {maxPrice && (
                    <Badge variant="outline" className="rounded-full px-3 py-1">
                      Max Price: ₹{maxPrice}
                      <button className="ml-1 text-muted-foreground hover:text-foreground">×</button>
                    </Badge>
                  )}
                </div>
              )}

              {/* Products grid */}
              <Suspense fallback={<SearchResultsSkeleton />}>
                <SearchResults
                  query={q}
                  category={category}
                  minPrice={minPrice}
                  maxPrice={maxPrice}
                />
              </Suspense>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}