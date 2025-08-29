import Image from "next/image"
import Link from "next/link"

const categories = [
  {
    name: "Electronics",
    image: "https://classyfyed.s3.us-east-1.amazonaws.com/electronics.jpg",
    href: "/collections/electronics",
  },
  {
    name: "Books & Stationery",
    image: "https://classyfyed.s3.us-east-1.amazonaws.com/stationary.jpg",
    href: "/collections/books-stationery",
  },
  {
    name: "Subscriptions",
    image: "https://classyfyed.s3.us-east-1.amazonaws.com/subscriptions.png",
    href: "/collections/subscriptions",
  },
  {
    name: "Fashion",
    image: "https://classyfyed.s3.us-east-1.amazonaws.com/fashion.png",
    href: "/collections/fashion",
  },
  {
    name: "Lifestyle",
    image: "https://classyfyed.s3.us-east-1.amazonaws.com/lifestyle.png",
    href: "/collections/lifestyle",
  },
]

export default function FeaturedCategories() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
      {categories.map((category) => (
        <Link key={category.name} href={category.href} className="group flex flex-col items-center text-center">
          <div className="relative mb-3 h-24 w-24 overflow-hidden rounded-full bg-muted p-1 transition-all group-hover:scale-105">
            <Image
            width={200}
            height={200}
              src={category.image || "/placeholder.svg"}
              alt={category.name}
              className="h-full w-full object-cover rounded-full"
            />
          </div>
          <h3 className="text-sm font-medium group-hover:text-primary">{category.name}</h3>
        </Link>
      ))}
    </div>
  )
}
