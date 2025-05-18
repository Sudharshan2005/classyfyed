import { NextResponse } from "next/server"

// Mock product data for search
const products = [
  {
    id: 1,
    name: "Premium Noise-Cancelling Headphones",
    price: 129.99,
    originalPrice: 249.99,
    category: "Electronics",
    subcategory: "Audio",
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    id: 2,
    name: "Ultrabook Pro 14-inch",
    price: 899.99,
    originalPrice: 1299.99,
    category: "Electronics",
    subcategory: "Laptops",
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    id: 3,
    name: "Design Software Annual Subscription",
    price: 99.99,
    originalPrice: 199.99,
    category: "Software & Subscriptions",
    subcategory: "Design Tools",
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    id: 4,
    name: "Smart Fitness Tracker",
    price: 59.99,
    originalPrice: 99.99,
    category: "Electronics",
    subcategory: "Wearables",
    image: "https://placehold.co/300x300",
  },
  {
    id: 5,
    name: "Wireless Earbuds Pro",
    price: 79.99,
    originalPrice: 149.99,
    category: "Electronics",
    subcategory: "Audio",
    image: "https://placehold.co/300x300",
  },
  {
    id: 6,
    name: "4K Ultra HD Monitor 27-inch",
    price: 299.99,
    originalPrice: 449.99,
    category: "Electronics",
    subcategory: "Monitors",
    image: "https://placehold.co/300x300",
  },
  {
    id: 7,
    name: "Productivity Suite Subscription",
    price: 69.99,
    originalPrice: 129.99,
    category: "Software & Subscriptions",
    subcategory: "Productivity Apps",
    image: "https://placehold.co/300x300",
  },
  {
    id: 8,
    name: "Mechanical Keyboard RGB",
    price: 89.99,
    originalPrice: 129.99,
    category: "Electronics",
    subcategory: "Accessories",
    image: "https://placehold.co/300x300",
  },
  {
    id: 9,
    name: "College Physics Textbook",
    price: 49.99,
    originalPrice: 79.99,
    category: "Books & Stationery",
    subcategory: "Textbooks",
    image: "https://placehold.co/300x300",
  },
  {
    id: 10,
    name: "Premium Notebook Set",
    price: 19.99,
    originalPrice: 29.99,
    category: "Books & Stationery",
    subcategory: "Notebooks",
    image: "https://placehold.co/300x300",
  },
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")
  const category = searchParams.get("category")
  const minPrice = searchParams.get("minPrice")
  const maxPrice = searchParams.get("maxPrice")

  let results = [...products]

  // Filter by search query
  if (query) {
    const searchTerms = query.toLowerCase().split(" ")
    results = results.filter((product) => {
      return searchTerms.some(
        (term) =>
          product.name.toLowerCase().includes(term) ||
          product.category.toLowerCase().includes(term) ||
          product.subcategory.toLowerCase().includes(term),
      )
    })
  }

  // Filter by category
  if (category) {
    results = results.filter((product) => product.category.toLowerCase() === category.toLowerCase())
  }

  // Filter by price range
  if (minPrice) {
    results = results.filter((product) => product.price >= Number.parseFloat(minPrice))
  }

  if (maxPrice) {
    results = results.filter((product) => product.price <= Number.parseFloat(maxPrice))
  }

  return NextResponse.json({ results })
}
