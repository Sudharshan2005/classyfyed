"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
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
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("token")
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto">
        <div className="flex h-16 items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6 text-blue-950" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4 mt-8">
                <Link href="/user/dashboard" className="text-lg font-semibold text-blue-950" passHref>
                  <SheetClose>Home</SheetClose>
                </Link>
                {categories.map((category) => (
                  <div key={category.name} className="space-y-2">
                    <div className="font-medium text-blue-950">{category.name}</div>
                    <div className="pl-4 space-y-1">
                      {category.subcategories.map((sub) => (
                        <Link
                          key={sub}
                          href={`/collections/${encodeURIComponent(category.name.toLowerCase())}/`}
                          className="text-blue-950 hover:text-primary block py-1"
                          passHref
                        >
                          <SheetClose>{sub}</SheetClose>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
                <Link href="/about" className="text-lg font-semibold text-blue-950" passHref>
                  <SheetClose>About</SheetClose>
                </Link>
                <Link href="/contact" className="text-lg font-semibold text-blue-950" passHref>
                  <SheetClose>Contact</SheetClose>
                </Link>
                <div className="space-y-2">
                  <div className="font-medium text-blue-950">Account</div>
                  <div className="pl-4 space-y-1">
                    <Link href="/user/dashboard" className="text-blue-950 hover:text-primary block py-1" passHref>
                      <SheetClose>Dashboard</SheetClose>
                    </Link>
                    <Link href="/profile" className="text-blue-950 hover:text-primary block py-1" passHref>
                      <SheetClose>Profile</SheetClose>
                    </Link>
                    <Link href="/orders" className="text-blue-950 hover:text-primary block py-1" passHref>
                      <SheetClose>Orders</SheetClose>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="text-blue-950 hover:text-primary block py-1 w-full text-left"
                    >
                      <SheetClose>Logout</SheetClose>
                    </button>
                  </div>
                </div>
              </nav>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center gap-2 mr-6">
            <span
              className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-[#194EB4] to-[#AC67DE]"
            >
              Classyfyed
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6 mx-6">
            <Link href="/user/dashboard" className="text-sm font-medium text-blue-950 transition-colors hover:text-primary">
              Home
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="p-0 h-auto font-medium text-sm text-blue-950">
                  Collections <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[400px] grid grid-cols-2 gap-3 p-4">
                {categories.map((category) => (
                  <div key={category.name} className="space-y-2">
                    <h4 className="font-medium text-blue-950">{category.name}</h4>
                    <div className="space-y-1">
                      {category.subcategories.map((sub) => (
                        <DropdownMenuItem key={sub} asChild>
                          <Link
                            href={`/collections/${encodeURIComponent(category.name.toLowerCase())}/`}
                            className="cursor-pointer text-blue-950 hover:text-primary"
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
            <Link href="/about" className="text-sm font-medium text-blue-950 transition-colors hover:text-primary">
              About
            </Link>
            <Link href="/contact" className="text-sm font-medium text-blue-950 transition-colors hover:text-primary">
              Contact
            </Link>
          </div>

          <div className="flex items-center ml-auto gap-4 text-blue-950">
          {isSearchOpen ? (
              <div className="flex items-center w-full md:w-auto">
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="w-full md:w-[200px] lg:w-[300px] placeholder-blue-950"
                />
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
                <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-blue-950 text-[10px] font-medium text-primary-foreground flex items-center justify-center">
                  0
                </span>
                <span className="sr-only">Cart</span>
              </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Account</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/user/dashboard" className="cursor-pointer text-blue-950">
                    Home
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer text-blue-950">
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/user/orders" className="cursor-pointer text-blue-950">
                    Orders
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-blue-950">
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}