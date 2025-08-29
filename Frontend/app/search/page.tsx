import { Suspense } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import SearchControls from "@/components/search-controls";
import ProductCard from "@/components/product-card";
import { IProduct } from "@/models/Product";
import { NextPage } from "next";

interface FilterConfig {
  brands: { id: string; name: string }[];
  subCategories: { id: string; name: string }[];
  priceRanges: { id: string; name: string; min: number; max: number }[];
  discounts: { id: string; name: string; min: number }[];
  ratings: { id: string; name: string; min: number }[];
}

async function SearchResults({
  query,
  category,
  minPrice,
  maxPrice,
  brands,
  subCategories,
  priceRanges,
  discounts,
  ratings,
  sortOption,
}: {
  query: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  brands?: string;
  subCategories?: string;
  priceRanges?: string;
  discounts?: string;
  ratings?: string;
  sortOption?: string;
}) {
  const queryParams = new URLSearchParams();
  if (query) queryParams.set("q", query);
  if (category) queryParams.set("category", category);
  if (minPrice) queryParams.set("minPrice", minPrice);
  if (maxPrice) queryParams.set("maxPrice", maxPrice);
  if (brands) queryParams.set("brands", brands);
  if (subCategories) queryParams.set("subCategories", subCategories);
  if (priceRanges) queryParams.set("priceRanges", priceRanges);
  if (discounts) queryParams.set("discounts", discounts);
  if (ratings) queryParams.set("ratings", ratings);
  if (sortOption && sortOption !== "relevance") queryParams.set("sort", sortOption);

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
  const apiUrl = `${baseUrl}/api/product/search?${queryParams.toString()}`;

  try {
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }
    const { products, filters }: { products: IProduct[]; filters: FilterConfig } = await response.json();

    let sortedProducts = products;
    if (sortOption) {
      sortedProducts = [...products].sort((a, b) => {
        if (sortOption === "price-low") return a.discountPrice - b.discountPrice;
        if (sortOption === "price-high") return b.discountPrice - a.discountPrice;
        if (sortOption === "discount") {
          const discountA = (a.originalPrice - a.discountPrice) / a.originalPrice;
          const discountB = (b.originalPrice - b.discountPrice) / b.originalPrice;
          return discountB - discountA;
        }
        if (sortOption === "newest") {
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        }
        return 0; // relevance (default)
      });
    }

    if (sortedProducts.length === 0) {
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
      <>
        <input type="hidden" id="filters-data" value={JSON.stringify(filters)} />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Search Results for &quot;{query}&quot;</h1>
            <p className="text-muted-foreground mt-1">Showing {sortedProducts.length} products</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={{
                _id: product._id,
                images: product.images,
                brandName: product.brandName,
                mobile: product.mobile,
                genericName: product.genericName,
                originalPrice: product.originalPrice,
                discountPrice: product.discountPrice,
                reviews: product.reviews,
                productModel: product.productModel,
                href: `/product/${product._id}`,
              }}
            />
          ))}
        </div>
        <div className="flex justify-center mt-12">
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" disabled>
              <ChevronRight className="h-4 w-4 rotate-180" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 font-medium bg-primary text-primary-foreground"
            >
              1
            </Button>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              2
            </Button>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              3
            </Button>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              ...
            </Button>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              10
            </Button>
            <Button variant="outline" size="icon">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </>
    );
  } catch (error: unknown) {
    console.error("Fetch error:", error);

    let errorMessage = "An error occurred while fetching products. Please try again later.";
    if (error instanceof Error) {
      if (error.message.includes("Failed to parse URL")) {
        errorMessage = "Invalid API URL. Please check the server configuration.";
      }
    }

    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-2">Error fetching products</h2>
        <p className="text-muted-foreground mb-6">{errorMessage}</p>
        <Button asChild>
          <Link href="/collections">Browse Collections</Link>
        </Button>
      </div>
    );
  }
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

interface SearchParams {
  q?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  brands?: string;
  subCategories?: string;
  priceRanges?: string;
  discounts?: string;
  ratings?: string;
  sort?: string;
}

type Props = {
  searchParams: Promise<SearchParams>;
};

const SearchPage: NextPage<Props> = async ({ searchParams }) => {
  const { q = "", category, minPrice, maxPrice, brands, subCategories, priceRanges, discounts, ratings, sort = "relevance" } = await searchParams;

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
            <SearchControls
              filtersDataId="filters-data"
              initialFilters={{ brands, subCategories, priceRanges, discounts, ratings }}
              query={q}
              category={category}
              minPrice={minPrice}
              maxPrice={maxPrice}
              sortOption={sort}
            />
            <div className="flex-1">
              <Suspense fallback={<SearchResultsSkeleton />}>
                <SearchResults
                  query={q}
                  category={category}
                  minPrice={minPrice}
                  maxPrice={maxPrice}
                  brands={brands}
                  subCategories={subCategories}
                  priceRanges={priceRanges}
                  discounts={discounts}
                  ratings={ratings}
                  sortOption={sort}
                />
              </Suspense>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SearchPage;