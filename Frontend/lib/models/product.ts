export interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice: number
  discount: number
  category: string
  subcategory: string
  images: string[]
  stock: number
  vendorId: string
  rating: number
  reviews: number
  specifications: Record<string, string>
  status: "draft" | "pending" | "active" | "inactive"
  createdAt: Date
  updatedAt: Date
}

// Mock product database
const products: Product[] = [
  {
    id: "prod_1",
    name: "Premium Noise-Cancelling Headphones",
    description:
      "Experience premium sound quality with these noise-cancelling headphones. Perfect for students who need to focus on their studies or enjoy music without distractions.",
    price: 129.99,
    originalPrice: 249.99,
    discount: 48,
    category: "Electronics",
    subcategory: "Audio",
    images: ["/placeholder.svg?height=300&width=300"],
    stock: 45,
    vendorId: "usr_3",
    rating: 4.5,
    reviews: 128,
    specifications: {
      Brand: "TechPro",
      Model: "XP-2023",
      Color: "Black",
      Connectivity: "Bluetooth 5.0",
      "Battery Life": "Up to 30 hours",
      Warranty: "1 Year Manufacturer Warranty",
    },
    status: "active",
    createdAt: new Date("2023-04-10"),
    updatedAt: new Date("2023-04-10"),
  },
  {
    id: "prod_2",
    name: "Ultrabook Pro 14-inch",
    description:
      "Powerful and lightweight laptop perfect for students. Features a high-resolution display, fast processor, and all-day battery life.",
    price: 899.99,
    originalPrice: 1299.99,
    discount: 31,
    category: "Electronics",
    subcategory: "Laptops",
    images: ["/placeholder.svg?height=300&width=300"],
    stock: 12,
    vendorId: "usr_3",
    rating: 4.8,
    reviews: 95,
    specifications: {
      Processor: "Intel Core i7 12th Gen",
      RAM: "16GB DDR4",
      Storage: "512GB SSD",
      Display: "14-inch 2.8K (2880 x 1800)",
      Graphics: "Intel Iris Xe",
      Battery: "Up to 12 hours",
      Weight: "1.3 kg",
    },
    status: "active",
    createdAt: new Date("2023-04-15"),
    updatedAt: new Date("2023-04-15"),
  },
]

// Mock product model functions
export const ProductModel = {
  findById: async (id: string) => {
    return products.find((p) => p.id === id) || null
  },

  findAll: async (filters: Partial<Product> = {}) => {
    let filteredProducts = [...products]

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      filteredProducts = filteredProducts.filter((p) => p[key as keyof Product] === value)
    })

    return filteredProducts
  },

  search: async (query: string, category?: string, minPrice?: number, maxPrice?: number) => {
    let results = [...products]

    // Filter by search query
    if (query) {
      const searchTerms = query.toLowerCase().split(" ")
      results = results.filter((product) => {
        return searchTerms.some(
          (term) =>
            product.name.toLowerCase().includes(term) ||
            product.description.toLowerCase().includes(term) ||
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
    if (minPrice !== undefined) {
      results = results.filter((product) => product.price >= minPrice)
    }

    if (maxPrice !== undefined) {
      results = results.filter((product) => product.price <= maxPrice)
    }

    return results
  },

  create: async (productData: Omit<Product, "id" | "createdAt" | "updatedAt">) => {
    const newProduct = {
      id: `prod_${products.length + 1}`,
      ...productData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    products.push(newProduct)
    return newProduct
  },

  update: async (id: string, productData: Partial<Product>) => {
    const productIndex = products.findIndex((p) => p.id === id)
    if (productIndex === -1) return null

    products[productIndex] = {
      ...products[productIndex],
      ...productData,
      updatedAt: new Date(),
    }

    return products[productIndex]
  },

  delete: async (id: string) => {
    const productIndex = products.findIndex((p) => p.id === id)
    if (productIndex === -1) return false

    products.splice(productIndex, 1)
    return true
  },
}
