import Link from "next/link"
import { ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Image from "next/image"

// Mock categories data
const categories = [
  {
    id: 1,
    name: "Electronics",
    description: "Laptops, smartphones, headphones, and more tech essentials for students",
    image: "/placeholder.svg?height=400&width=600",
    href: "/collections/electronics",
    featured: true,
  },
  {
    id: 2,
    name: "Books & Stationery",
    description: "Textbooks, notebooks, and study materials for all courses",
    image: "/placeholder.svg?height=400&width=600",
    href: "/collections/books-stationery",
    featured: true,
  },
  {
    id: 3,
    name: "Software & Subscriptions",
    description: "Productivity tools, design software, and learning platforms",
    image: "/placeholder.svg?height=400&width=600",
    href: "/collections/software-subscriptions",
    featured: true,
  },
  {
    id: 4,
    name: "Fashion",
    description: "Casual wear, formal attire, and accessories for campus life",
    image: "/placeholder.svg?height=400&width=600",
    href: "/collections/fashion",
    featured: false,
  },
  {
    id: 5,
    name: "Lifestyle",
    description: "Dorm essentials, fitness gear, and personal care products",
    image: "/placeholder.svg?height=400&width=600",
    href: "/collections/lifestyle",
    featured: false,
  },
  {
    id: 6,
    name: "Entertainment",
    description: "Gaming, streaming services, and entertainment subscriptions",
    image: "/placeholder.svg?height=400&width=600",
    href: "/collections/entertainment",
    featured: false,
  },
]

// Mock subcategories
const subcategories = {
  electronics: ["Laptops", "Smartphones", "Audio", "Accessories", "Tablets", "Monitors"],
  books: ["Textbooks", "Notebooks", "Art Supplies", "Study Guides", "Stationery", "Calculators"],
  software: ["Design Tools", "Productivity Apps", "Learning Platforms", "Security Software", "Cloud Storage", "Gaming"],
  fashion: ["Casual Wear", "Formal Attire", "Footwear", "Accessories", "Bags", "Winter Wear"],
  lifestyle: ["Dorm Essentials", "Fitness", "Personal Care", "Backpacks", "Water Bottles", "Lunch Boxes"],
  entertainment: ["Gaming", "Streaming", "Music", "Movies", "Board Games", "Outdoor Games"],
}

export default function CollectionsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto py-10 px-4">
          <div className="flex items-center text-sm mb-6">
            <Link href="/" className="text-muted-foreground hover:text-foreground">
              Home
            </Link>
            <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />
            <span className="font-medium">Collections</span>
          </div>

          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold mb-2">Browse All Collections</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our wide range of products with exclusive student discounts across various categories
            </p>
          </div>

          {/* Featured Categories */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-6">Featured Categories</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {categories
                .filter((category) => category.featured)
                .map((category) => (
                  <Link key={category.id} href={category.href} className="group">
                    <div className="relative overflow-hidden rounded-lg aspect-[4/3]">
                      <Image
                        src={category.image || "/placeholder.svg"}
                        alt={category.name}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6 text-white">
                        <h3 className="text-xl font-bold mb-1">{category.name}</h3>
                        <p className="text-sm text-white/80 mb-3">{category.description}</p>
                        <div className="flex items-center text-sm font-medium">
                          <span>Shop Now</span>
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>

          {/* All Categories */}
          <div>
            <h2 className="text-2xl font-bold mb-6">All Categories</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {categories.map((category) => (
                <Card key={category.id} className="overflow-hidden">
                  <div className="aspect-video overflow-hidden">
                    <Image
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                    <p className="text-muted-foreground mb-4 line-clamp-2">{category.description}</p>

                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {subcategories[
                        category.name.toLowerCase().split(" ")[0].toLowerCase() as keyof typeof subcategories
                      ]
                        ?.slice(0, 6)
                        .map((subcat, index) => (
                          <Link
                            key={index}
                            href={`${category.href}/${subcat.toLowerCase().replace(/\s+/g, "-")}`}
                            className="text-sm text-muted-foreground hover:text-primary"
                          >
                            {subcat}
                          </Link>
                        ))}
                    </div>

                    <Button asChild variant="outline" className="w-full">
                      <Link href={category.href}>View All {category.name}</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
