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

// Mock data for products
const products = [
  {
    id: 1,
    name: "Premium Noise-Cancelling Headphones",
    price: 129.99,
    originalPrice: 249.99,
    image: "https://placehold.co/300x300/png",
    discount: 48,
    rating: 4.5,
    reviews: 128,
    href: "/product/premium-noise-cancelling-headphones",
  },
  {
    id: 2,
    name: "Ultrabook Pro 14-inch",
    price: 899.99,
    originalPrice: 1299.99,
    image: "https://placehold.co/300x300/png",
    discount: 31,
    rating: 4.8,
    reviews: 95,
    href: "/product/ultrabook-pro-14-inch",
  },
  {
    id: 3,
    name: "Design Software Annual Subscription",
    price: 99.99,
    originalPrice: 199.99,
    image: "https://placehold.co/300x300/png",
    discount: 50,
    rating: 4.2,
    reviews: 67,
    href: "/product/design-software-annual-subscription",
  },
  {
    id: 4,
    name: "Smart Fitness Tracker",
    price: 59.99,
    originalPrice: 99.99,
    image: "https://placehold.co/300x300/png",
    discount: 40,
    rating: 4.6,
    reviews: 203,
    href: "/product/smart-fitness-tracker",
  },
  {
    id: 5,
    name: "Wireless Earbuds Pro",
    price: 79.99,
    originalPrice: 149.99,
    image: "https://placehold.co/300x300/png",
    discount: 47,
    rating: 4.4,
    reviews: 156,
    href: "/product/wireless-earbuds-pro",
  },
  {
    id: 6,
    name: "4K Ultra HD Monitor 27-inch",
    price: 299.99,
    originalPrice: 449.99,
    image: "https://placehold.co/300x300/png",
    discount: 33,
    rating: 4.7,
    reviews: 89,
    href: "/product/4k-ultra-hd-monitor",
  },
  {
    id: 7,
    name: "Productivity Suite Subscription",
    price: 69.99,
    originalPrice: 129.99,
    image: "https://placehold.co/300x300/png",
    discount: 46,
    rating: 4.3,
    reviews: 112,
    href: "/product/productivity-suite-subscription",
  },
  {
    id: 8,
    name: "Mechanical Keyboard RGB",
    price: 89.99,
    originalPrice: 129.99,
    image: "https://placehold.co/300x300/png",
    discount: 31,
    rating: 4.5,
    reviews: 78,
    href: "/product/mechanical-keyboard-rgb",
  },
];

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

// Define the props type
type Props = {
  params: Promise<{ category: string }>;
};

export default async function CategoryPage({ params }: Props) {
  const { category } = await params; // Unwrap the Promise
  const categoryName = category.replace(/-/g, " ");
  const formattedCategoryName = categoryName
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

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
            <span className="font-medium">{formattedCategoryName}</span>
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
                  <Accordion type="multiple" defaultValue={["brands", "price", "discount", "rating"]}>
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
                  <h1 className="text-2xl font-bold">{formattedCategoryName}</h1>
                  <p className="text-muted-foreground mt-1">Showing {products.length} products</p>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="md:hidden">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground hidden sm:inline">Sort by:</span>
                    <Select defaultValue="popularity">
                      <SelectTrigger className="w-[180px] h-9">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="popularity">Popularity</SelectItem>
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
              <div className="flex flex-wrap gap-2 mb-6">
                <Badge variant="outline" className="rounded-full px-3 py-1">
                  Under ₹10,000
                  <button className="ml-1 text-muted-foreground hover:text-foreground">×</button>
                </Badge>
                <Badge variant="outline" className="rounded-full px-3 py-1">
                  4★ & above
                  <button className="ml-1 text-muted-foreground hover:text-foreground">×</button>
                </Badge>
                <Badge variant="outline" className="rounded-full px-3 py-1">
                  25% or more
                  <button className="ml-1 text-muted-foreground hover:text-foreground">×</button>
                </Badge>
              </div>

              {/* Products grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
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
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}