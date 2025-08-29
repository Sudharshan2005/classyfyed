"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Filter } from "lucide-react";
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

interface FilterState {
  brands: string[];
  subCategories: string[];
  priceRanges: string[];
  discounts: string[];
  ratings: string[];
}

interface FilterConfig {
  brands: { id: string; name: string }[];
  subCategories: { id: string; name: string }[];
  priceRanges: { id: string; name: string; min: number; max: number }[];
  discounts: { id: string; name: string; min: number }[];
  ratings: { id: string; name: string; min: number }[];
}

interface SearchControlsProps {
  filtersDataId: string;
  initialFilters: {
    brands?: string;
    subCategories?: string;
    priceRanges?: string;
    discounts?: string;
    ratings?: string;
  };
  query: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  sortOption: string;
}

export default function SearchControls({
  filtersDataId,
  initialFilters,
  query,
  category,
  minPrice,
  maxPrice,
  sortOption,
}: SearchControlsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<FilterConfig>({
    brands: [],
    subCategories: [],
    priceRanges: [
      { id: "price-1", name: "Under ₹1,000", min: 0, max: 1000 },
      { id: "price-2", name: "₹1,000 - ₹5,000", min: 1000, max: 5000 },
      { id: "price-3", name: "₹5,000 - ₹10,000", min: 5000, max: 10000 },
      { id: "price-4", name: "₹10,000 - ₹20,000", min: 10000, max: 20000 },
      { id: "price-5", name: "Above ₹20,000", min: 20000, max: Infinity },
    ],
    discounts: [
      { id: "discount-1", name: "10% or more", min: 10 },
      { id: "discount-2", name: "25% or more", min: 25 },
      { id: "discount-3", name: "50% or more", min: 50 },
      { id: "discount-4", name: "60% or more", min: 60 },
      { id: "discount-5", name: "75% or more", min: 75 },
    ],
    ratings: [
      { id: "rating-4", name: "4★ & above", min: 4 },
      { id: "rating-3", name: "3★ & above", min: 3 },
      { id: "rating-2", name: "2★ & above", min: 2 },
      { id: "rating-1", name: "1★ & above", min: 1 },
    ],
  });
  const [selectedFilters, setSelectedFilters] = useState<FilterState>({
    brands: initialFilters.brands?.split(",").filter(Boolean) || [],
    subCategories: initialFilters.subCategories?.split(",").filter(Boolean) || [],
    priceRanges: initialFilters.priceRanges?.split(",").filter(Boolean) || [],
    discounts: initialFilters.discounts?.split(",").filter(Boolean) || [],
    ratings: initialFilters.ratings?.split(",").filter(Boolean) || [],
  });

  useEffect(() => {
    const filtersElement = document.getElementById(filtersDataId) as HTMLInputElement;
    const filtersData = filtersElement?.value;
    if (filtersData) {
      const parsedFilters = JSON.parse(filtersData) as FilterConfig;
      setFilters((prev) => ({
        ...prev,
        brands: parsedFilters.brands,
        subCategories: parsedFilters.subCategories,
      }));
    }
    
  }, [filtersDataId]);
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (query) {
      params.set("q", query);
    } else {
      params.delete("q");
    }
    if (category) {
      params.set("category", category);
    } else {
      params.delete("category");
    }
    if (minPrice) {
      params.set("minPrice", minPrice);
    } else {
      params.delete("minPrice");
    }
    if (maxPrice) {
      params.set("maxPrice", maxPrice);
    } else {
      params.delete("maxPrice");
    }
    if (selectedFilters.brands.length) {
      params.set("brands", selectedFilters.brands.join(","));
    } else {
      params.delete("brands");
    }
    if (selectedFilters.subCategories.length) {
      params.set("subCategories", selectedFilters.subCategories.join(","));
    } else {
      params.delete("subCategories");
    }
    if (selectedFilters.priceRanges.length) {
      params.set("priceRanges", selectedFilters.priceRanges.join(","));
    } else {
      params.delete("priceRanges");
    }
    if (selectedFilters.discounts.length) {
      params.set("discounts", selectedFilters.discounts.join(","));
    } else {
      params.delete("discounts");
    }
    if (selectedFilters.ratings.length) {
      params.set("ratings", selectedFilters.ratings.join(","));
    } else {
      params.delete("ratings");
    }
    if (sortOption !== "relevance") {
      params.set("sort", sortOption);
    } else {
      params.delete("sort");
    }
    router.push(`/search?${params.toString()}`, { scroll: false });
  }, [selectedFilters, sortOption, query, category, minPrice, maxPrice, router, searchParams]);

  const handleFilterChange = (filterType: keyof FilterState, filterId: string) => {
    setSelectedFilters((prev) => {
      const currentFilters = prev[filterType];
      if (currentFilters.includes(filterId)) {
        return {
          ...prev,
          [filterType]: currentFilters.filter((id) => id !== filterId),
        };
      }
      return {
        ...prev,
        [filterType]: [...currentFilters, filterId],
      };
    });
  };

  const clearAllFilters = () => {
    setSelectedFilters({
      brands: [],
      subCategories: [],
      priceRanges: [],
      discounts: [],
      ratings: [],
    });
    router.push(`/search?q=${encodeURIComponent(query)}`, { scroll: false });
  };

  const removeFilter = (filterType: keyof FilterState | "category" | "minPrice" | "maxPrice", value: string) => {
    if (filterType === "category") {
      router.push(
        `/search?${new URLSearchParams({
          ...Object.fromEntries(searchParams),
          category: "",
        }).toString()}`,
        { scroll: false }
      );
    } else if (filterType === "minPrice") {
      router.push(
        `/search?${new URLSearchParams({
          ...Object.fromEntries(searchParams),
          minPrice: "",
        }).toString()}`,
        { scroll: false }
      );
    } else if (filterType === "maxPrice") {
      router.push(
        `/search?${new URLSearchParams({
          ...Object.fromEntries(searchParams),
          maxPrice: "",
        }).toString()}`,
        { scroll: false }
      );
    } else {
      setSelectedFilters((prev) => ({
        ...prev,
        [filterType]: prev[filterType].filter((id) => id !== value),
      }));
    }
  };

  return (
    <div className="w-full md:w-64 md:flex-shrink-0">
      <div className="md:sticky md:top-20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="md:hidden">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground hidden sm:inline">Sort by:</span>
              <Select
                value={sortOption}
                onValueChange={(value) => {
                  const params = new URLSearchParams(searchParams);
                  if (value !== "relevance") {
                    params.set("sort", value);
                  } else {
                    params.delete("sort");
                  }
                  router.push(`/search?${params.toString()}`, { scroll: false });
                }}
              >
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

        {(category ||
          minPrice ||
          maxPrice ||
          selectedFilters.brands.length ||
          selectedFilters.subCategories.length ||
          selectedFilters.priceRanges.length ||
          selectedFilters.discounts.length ||
          selectedFilters.ratings.length) && (
          <div className="flex flex-wrap gap-2 mb-6">
            {category && (
              <Badge variant="outline" className="rounded-full px-3 py-1">
                Category: {category}
                <button
                  className="ml-1 text-muted-foreground hover:text-foreground"
                  onClick={() => removeFilter("category", category)}
                >
                  ×
                </button>
              </Badge>
            )}
            {minPrice && (
              <Badge variant="outline" className="rounded-full px-3 py-1">
                Min Price: ₹{minPrice}
                <button
                  className="ml-1 text-muted-foreground hover:text-foreground"
                  onClick={() => removeFilter("minPrice", minPrice)}
                >
                  ×
                </button>
              </Badge>
            )}
            {maxPrice && (
              <Badge variant="outline" className="rounded-full px-3 py-1">
                Max Price: ₹{maxPrice}
                <button
                  className="ml-1 text-muted-foreground hover:text-foreground"
                  onClick={() => removeFilter("maxPrice", maxPrice)}
                >
                  ×
                </button>
              </Badge>
            )}
            {selectedFilters.brands.map((brandId) => {
              const brand = filters.brands.find((b) => b.id === brandId);
              return (
                brand && (
                  <Badge key={brandId} variant="outline" className="rounded-full px-3 py-1">
                    {brand.name}
                    <button
                      className="ml-1 text-muted-foreground hover:text-foreground"
                      onClick={() => removeFilter("brands", brandId)}
                    >
                      ×
                    </button>
                  </Badge>
                )
              );
            })}
            {selectedFilters.subCategories.map((subCategoryId) => {
              const subCategory = filters.subCategories.find((sc) => sc.id === subCategoryId);
              return (
                subCategory && (
                  <Badge key={subCategoryId} variant="outline" className="rounded-full px-3 py-1">
                    {subCategory.name}
                    <button
                      className="ml-1 text-muted-foreground hover:text-foreground"
                      onClick={() => removeFilter("subCategories", subCategoryId)}
                    >
                      ×
                    </button>
                  </Badge>
                )
              );
            })}
            {selectedFilters.priceRanges.map((priceId) => {
              const price = filters.priceRanges.find((p) => p.id === priceId);
              return (
                price && (
                  <Badge key={priceId} variant="outline" className="rounded-full px-3 py-1">
                    {price.name}
                    <button
                      className="ml-1 text-muted-foreground hover:text-foreground"
                      onClick={() => removeFilter("priceRanges", priceId)}
                    >
                      ×
                    </button>
                  </Badge>
                )
              );
            })}
            {selectedFilters.discounts.map((discountId) => {
              const discount = filters.discounts.find((d) => d.id === discountId);
              return (
                discount && (
                  <Badge key={discountId} variant="outline" className="rounded-full px-3 py-1">
                    {discount.name}
                    <button
                      className="ml-1 text-muted-foreground hover:text-foreground"
                      onClick={() => removeFilter("discounts", discountId)}
                    >
                      ×
                    </button>
                  </Badge>
                )
              );
            })}
            {selectedFilters.ratings.map((ratingId) => {
              const rating = filters.ratings.find((r) => r.id === ratingId);
              return (
                rating && (
                  <Badge key={ratingId} variant="outline" className="rounded-full px-3 py-1">
                    {rating.name}
                    <button
                      className="ml-1 text-muted-foreground hover:text-foreground"
                      onClick={() => removeFilter("ratings", ratingId)}
                    >
                      ×
                    </button>
                  </Badge>
                )
              );
            })}
          </div>
        )}

        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-lg">Filters</h2>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-primary"
            onClick={clearAllFilters}
          >
            Clear All
          </Button>
        </div>

        <div className="space-y-4">
          <Accordion
            type="multiple"
            defaultValue={["brands", "subCategories", "price", "discount", "rating"]}
          >
            <AccordionItem value="brands">
              <AccordionTrigger className="py-2">Brands</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {filters.brands.map((brand) => (
                    <div key={brand.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={brand.id}
                        checked={selectedFilters.brands.includes(brand.id)}
                        onCheckedChange={() => handleFilterChange("brands", brand.id)}
                      />
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

            <AccordionItem value="subCategories">
              <AccordionTrigger className="py-2">Sub Category</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {filters.subCategories.map((subCategory) => (
                    <div key={subCategory.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={subCategory.id}
                        checked={selectedFilters.subCategories.includes(subCategory.id)}
                        onCheckedChange={() => handleFilterChange("subCategories", subCategory.id)}
                      />
                      <label
                        htmlFor={subCategory.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {subCategory.name}
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
                      <Checkbox
                        id={price.id}
                        checked={selectedFilters.priceRanges.includes(price.id)}
                        onCheckedChange={() => handleFilterChange("priceRanges", price.id)}
                      />
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
                      <Checkbox
                        id={discount.id}
                        checked={selectedFilters.discounts.includes(discount.id)}
                        onCheckedChange={() => handleFilterChange("discounts", discount.id)}
                      />
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
                      <Checkbox
                        id={rating.id}
                        checked={selectedFilters.ratings.includes(rating.id)}
                        onCheckedChange={() => handleFilterChange("ratings", rating.id)}
                      />
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
  );
}