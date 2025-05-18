"use client"

import { useState } from "react"
import Link from "next/link"
import { ShoppingCart, Heart, User, Menu, X, ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import SearchDialog from "@/components/search-dialog"

const categories = [
  {
    name: "Electronics",
    subcategories: ["Laptops", "Smartphones", "Accessories", "Audio"],
  },
  {
    name: "Books & Stationery",
    subcategories: ["Textbooks", "Notebooks", "Art Supplies", "Study Guides"],
  },
  {
    name: "Software & Subscriptions",
    subcategories: ["Design Tools", "Productivity Apps", "Learning Platforms", "Entertainment"],
  },
  {
    name: "Fashion",
    subcategories: ["Casual Wear", "Formal Attire", "Footwear", "Accessories"],
  },
  {
    name: "Lifestyle",
    subcategories: ["Dorm Essentials", "Fitness", "Personal Care", "Backpacks"],
  },
]

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto">
        <div className="flex h-16 items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4 mt-8">
                <Link href="/user/dashboard" className="text-lg font-semibold" passHref>
                  <SheetClose>Home</SheetClose>
                </Link>
                {categories.map((category) => (
                  <div key={category.name} className="space-y-2">
                    <div className="font-medium">{category.name}</div>
                    <div className="pl-4 space-y-1">
                      {category.subcategories.map((sub) => (
                        <Link
                          key={sub}
                          href={`/collections/${category.name.toLowerCase()}/${sub.toLowerCase().replace(/\s+/g, "-")}`}
                          className="text-muted-foreground hover:text-foreground block py-1"
                          passHref
                        >
                          <SheetClose>{sub}</SheetClose>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
                <Link href="/about" className="text-lg font-semibold" passHref>
                  <SheetClose>About</SheetClose>
                </Link>
                <Link href="/contact" className="text-lg font-semibold" passHref>
                  <SheetClose>Contact</SheetClose>
                </Link>
              </nav>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center gap-2 mr-6">
            <span className="font-bold text-xl">Classyfyed</span>
          </Link>

          <div className="hidden md:flex items-center gap-6 mx-6">
            <Link href="/user/dashboard" className="text-sm font-medium transition-colors hover:text-primary">
              Home
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="p-0 h-auto font-medium text-sm">
                  Collections <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[400px] grid grid-cols-2 gap-3 p-4">
                {categories.map((category) => (
                  <div key={category.name} className="space-y-2">
                    <h4 className="font-medium">{category.name}</h4>
                    <div className="space-y-1">
                      {category.subcategories.map((sub) => (
                        <DropdownMenuItem key={sub} asChild>
                          <Link
                            href={`/collections/${category.name.toLowerCase()}/${sub.toLowerCase().replace(/\s+/g, "-")}`}
                            className="cursor-pointer"
                          >
                            {sub}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </div>
                  </div>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Link href="/about" className="text-sm font-medium transition-colors hover:text-primary">
              About
            </Link>
            <Link href="/contact" className="text-sm font-medium transition-colors hover:text-primary">
              Contact
            </Link>
          </div>

          <div className="flex items-center ml-auto gap-4">
            {isSearchOpen ? (
              <div className="flex items-center w-full md:w-auto">
                <Input type="search" placeholder="Search products..." className="w-full md:w-[200px] lg:w-[300px]" />
                <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <SearchDialog />
            )}

            <Link href="/wishlist" className="hidden sm:flex">
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
                <span className="sr-only">Wishlist</span>
              </Button>
            </Link>

            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
                  0
                </span>
                <span className="sr-only">Cart</span>
              </Button>
            </Link>

            <Link href="/auth/login">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
                <span className="sr-only">Account</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
