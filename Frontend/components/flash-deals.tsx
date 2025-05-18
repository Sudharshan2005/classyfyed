import Link from "next/link"
import { Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

const products = [
  {
    id: 1,
    name: "Premium Noise-Cancelling Headphones",
    price: 129.99,
    originalPrice: 249.99,
    image: "/placeholder.svg?height=300&width=300",
    discount: 48,
    href: "/product/premium-noise-cancelling-headphones",
  },
  {
    id: 2,
    name: "Ultrabook Pro 14-inch",
    price: 899.99,
    originalPrice: 1299.99,
    image: "/placeholder.svg?height=300&width=300",
    discount: 31,
    href: "/product/ultrabook-pro-14-inch",
  },
  {
    id: 3,
    name: "Design Software Annual Subscription",
    price: 99.99,
    originalPrice: 199.99,
    image: "/placeholder.svg?height=300&width=300",
    discount: 50,
    href: "/product/design-software-annual-subscription",
  },
  {
    id: 4,
    name: "Smart Fitness Tracker",
    price: 59.99,
    originalPrice: 99.99,
    image: "/placeholder.svg?height=300&width=300",
    discount: 40,
    href: "/product/smart-fitness-tracker",
  },
]

export default function FlashDeals() {
  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Clock className="h-5 w-5 text-red-500" />
        <div className="text-sm font-medium">Ends in: 23:59:59</div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link href={product.href} key={product.id} className="group">
            <div className="relative overflow-hidden rounded-lg border bg-background transition-all hover:shadow-md">
              <Badge className="absolute top-2 right-2 bg-red-500 hover:bg-red-600">{product.discount}% OFF</Badge>
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="object-cover w-full h-full transition-transform group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-sm line-clamp-2 mb-2 group-hover:text-primary">{product.name}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold">${product.price}</span>
                  <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span>
                </div>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" className="w-full">
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
