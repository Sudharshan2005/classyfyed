"use client";

import { useState, useEffect, use } from "react";
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
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ProductCard from "@/components/product-card";
import { IProduct } from "@/models/Product";

type Props = {
  params: Promise<{ category: string }>;
};

export default function CategoryPage(props: Props) {
  const params = use(props.params);
  const [resolvedParams, setResolvedParams] = useState<{ category: string } | null>(null);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<{
    brands: string[];
    priceRanges: string[];
    discounts: string[];
    ratings: string[];
    subCategories: string[];
  }>({
    brands: [],
    priceRanges: [],
    discounts: [],
    ratings: [],
    subCategories: [],
  });
  const [sortOption, setSortOption] = useState("popularity");
  const [filters, setFilters] = useState<{
    brands: { id: string; name: string }[];
    subCategories: { id: string; name: string }[];
    priceRanges: { id: string; name: string; min: number; max: number }[];
    discounts: { id: string; name: string; min: number }[];
    ratings: { id: string; name: string; min: number }[];
  }>({
    brands: [],
    subCategories: [],
    priceRanges: [
      { id: "price-1", name: "Under $100", min: 0, max: 100 },
      { id: "price-2", name: "$100 - $500", min: 100, max: 500 },
      { id: "price-3", name: "$500 - $1000", min: 500, max: 1000 },
      { id: "price-4", name: "$1000 - $2000", min: 1000, max: 2000 },
      { id: "price-5", name: "Above $2000", min: 2000, max: Infinity },
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

  useEffect(() => {
    if (params?.category) {
      setResolvedParams({category: decodeURIComponent(params.category)});
    }
  }, [params]);

  useEffect(() => {
    if (resolvedParams) {
      const fetchProducts = async () => {
        try {
          const response = await fetch(`/api/product/${resolvedParams.category}`);
          if (!response.ok) {
            throw new Error(`Failed to fetch products: ${response.statusText}`);
          }
          const data: IProduct[] = await response.json();
          setProducts(data.filter((each) => each.status === "active"));

          const uniqueBrands = Array.from(new Set(data.map((p) => p.brandName))).map((name, index) => ({
            id: `brand-${index + 1}`,
            name,
          }));
          const uniqueSubCategories = Array.from(new Set(data.map((p) => p.subCategory))).map(
            (name, index) => ({
              id: `subcategory-${index + 1}`,
              name,
            })
          );
          setFilters((prev) => ({
            ...prev,
            brands: uniqueBrands,
            subCategories: uniqueSubCategories,
          }));
        } catch (error) {
          console.error("Error fetching products:", error);
        }
      };
      fetchProducts();
    }
  }, [resolvedParams]);

  if (!resolvedParams) {
    return <div>Loading...</div>;
  }

  const { category } = resolvedParams;
  const categoryName = category.replace(/-/g, " ");
  const formattedCategoryName = categoryName
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  // Handle filter changes
  const handleFilterChange = (filterType: keyof typeof selectedFilters, filterId: string) => {
    setSelectedFilters((prev) => {
      const currentFilters = prev[filterType];
      if (currentFilters.includes(filterId)) {
        return {
          ...prev,
          [filterType]: currentFilters.filter((id) => id !== filterId),
        };
      } else {
        return {
          ...prev,
          [filterType]: [...currentFilters, filterId],
        };
      }
    });
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedFilters({
      brands: [],
      priceRanges: [],
      discounts: [],
      ratings: [],
      subCategories: [],
    });
  };

  // Remove a specific filter
  const removeFilter = (filterType: keyof typeof selectedFilters, filterId: string) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterType]: prev[filterType].filter((id) => id !== filterId),
    }));
  };

  // Filter products
  const filteredProducts = products.filter((product) => {
    // Price Range Filter
    const priceFilterPass = selectedFilters.priceRanges.length
      ? selectedFilters.priceRanges.some((priceId) => {
          const priceRange = filters.priceRanges.find((p) => p.id === priceId);
          return priceRange && product.discountPrice >= priceRange.min && product.discountPrice < priceRange.max;
        })
      : true;

    // Discount Filter
    const discountFilterPass = selectedFilters.discounts.length
      ? selectedFilters.discounts.some((discountId) => {
          const discount = filters.discounts.find((d) => d.id === discountId);
          const discountPercent = ((product.originalPrice - product.discountPrice) / product.originalPrice) * 100;
          return discount && discountPercent >= discount.min;
        })
      : true;

    // Rating Filter
    const ratingFilterPass = selectedFilters.ratings.length
      ? selectedFilters.ratings.some((ratingId) => {
          const rating = filters.ratings.find((r) => r.id === ratingId);
          const avgRating =
            product.reviews.length > 0
              ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
              : 0;
          return rating && avgRating >= rating.min;
        })
      : true;

    // Brand Filter
    const brandFilterPass = selectedFilters.brands.length
      ? selectedFilters.brands.some((brandId) => {
          const brand = filters.brands.find((b) => b.id === brandId);
          return brand && product.brandName === brand.name;
        })
      : true;

    // SubCategory Filter
    const subCategoryFilterPass = selectedFilters.subCategories.length
      ? selectedFilters.subCategories.some((subCategoryId) => {
          const subCategory = filters.subCategories.find((sc) => sc.id === subCategoryId);
          return subCategory && product.subCategory === subCategory.name;
        })
      : true;

    return priceFilterPass && discountFilterPass && ratingFilterPass && brandFilterPass && subCategoryFilterPass;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case "price-low":
        return a.discountPrice - b.discountPrice;
      case "price-high":
        return b.discountPrice - a.discountPrice;
      case "discount":
        const discountA = ((a.originalPrice - a.discountPrice) / a.originalPrice) * 100;
        const discountB = ((b.originalPrice - b.discountPrice) / b.originalPrice) * 100;
        return discountB - discountA;
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "popularity":
      default:
        return b.reviews.length - a.reviews.length;
    }
  });

  return (
    <div className="flex min-h-screen flex-col text-blue-950">
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
            <span className="font-medium">{formattedCategoryName}</span>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Filters - Desktop */}
            <div className="hidden md:block w-64 flex-shrink-0">
              <div className="sticky top-20">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-lg">Filters</h2>
                  <Button variant="ghost" size="sm" className="h-8 text-blue-950" onClick={clearAllFilters}>
                    Clear All
                  </Button>
                </div>

                <div className="space-y-4">
                  <Accordion type="multiple" defaultValue={["brands", "subCategories", "price", "discount", "rating"]}>
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

            {/* Main content */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-2xl font-bold">{decodeURIComponent(formattedCategoryName)}</h1>
                  <p className="text-muted-foreground mt-1">Showing {sortedProducts.length} products</p>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="md:hidden">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-blue-950 hidden sm:inline">Sort by:</span>
                    <Select value={sortOption} onValueChange={setSortOption}>
                      <SelectTrigger className="w-[180px] h-9">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem className="text-blue-950" value="popularity">Popularity</SelectItem>
                        <SelectItem className="text-blue-950" value="price-low">Price: Low to High</SelectItem>
                        <SelectItem className="text-blue-950" value="price-high">Price: High to Low</SelectItem>
                        <SelectItem className="text-blue-950" value="discount">Discount</SelectItem>
                        <SelectItem className="text-blue-950" value="newest">Newest First</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Applied filters */}
              <div className="flex flex-wrap gap-2 mb-6">
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

              {/* Products grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sortedProducts.map((product: IProduct) => (
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

              {/* Pagination */}
              <div className="flex justify-center mt-12 text-blue-950">
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="icon" disabled>
                    <ChevronRight className="h-4 w-4 rotate-180" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0 font-medium bg-blue-950 text-primary-foreground"
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
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}