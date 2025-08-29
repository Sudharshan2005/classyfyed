import Link from "next/link"
import { SocialIcon } from 'react-social-icons'

export default function Footer() {
  return (
    <footer className="bg-muted py-12 px-4 md:px-6 text-blue-950">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Classyfyed</h3>
            <p className="text-muted-foreground mb-4">
              The premier platform for verified students to access exclusive discounts on products and subscriptions.
            </p>
            <div className="flex space-x-2 sm:space-x-4">
            <SocialIcon
              bgColor="transparent"
              fgColor="blue"
              url="https://t.me/classyfyed"
              style={{ width: '2rem', height: '2rem' }}
              className="w-6 h-6 sm:w-8 sm:h-8"
              target="_blank"
              rel="noopener noreferrer"
            />
            <SocialIcon
              bgColor="transparent"
              fgColor="blue"
              url="https://www.instagram.com/classyfyed.in/"
              style={{ width: '2rem', height: '2rem' }}
              className="w-6 h-6 sm:w-8 sm:h-8"
              target="_blank"
              rel="noopener noreferrer"
            />
            <SocialIcon
              bgColor="transparent"
              fgColor="blue"
              url="https://www.facebook.com/classyfyed.in/"
              style={{ width: '2rem', height: '2rem' }}
              className="w-6 h-6 sm:w-8 sm:h-8"
              target="_blank"
              rel="noopener noreferrer"
            />
            <SocialIcon
              bgColor="transparent"
              fgColor="blue"
              url="https://whatsapp.com/channel/0029Vb7xJATJpe8jQSk5dQ1f"
              style={{ width: '2rem', height: '2rem' }}
              className="w-6 h-6 sm:w-8 sm:h-8"
              target="_blank"
              rel="noopener noreferrer"
            />
            <SocialIcon
              bgColor="transparent"
              fgColor="blue"
              url="https://x.com/_Classyfyed"
              style={{ width: '2rem', height: '2rem' }}
              className="w-6 h-6 sm:w-8 sm:h-8"
              target="_blank"
              rel="noopener noreferrer"
            />
            <SocialIcon
              bgColor="transparent"
              fgColor="blue"
              url="https://www.youtube.com/channel/UC5X542lwTzQPN1qMbcdnXMg"
              style={{ width: '2rem', height: '2rem' }}
              className="w-6 h-6 sm:w-8 sm:h-8"
              target="_blank"
              rel="noopener noreferrer"
            />
            <SocialIcon
              bgColor="transparent"
              fgColor="blue"
              url="https://www.reddit.com/user/classyfyed/"
              style={{ width: '2rem', height: '2rem' }}
              className="w-6 h-6 sm:w-8 sm:h-8"
              target="_blank"
              rel="noopener noreferrer"
            />
          </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-primary">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-primary">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/collections/electronics" className="text-muted-foreground hover:text-primary">
                  Electronics
                </Link>
              </li>
              <li>
                <Link href="/collections/books-stationery" className="text-muted-foreground hover:text-primary">
                  Books & Stationery
                </Link>
              </li>
              <li>
                <Link href="/collections/software" className="text-muted-foreground hover:text-primary">
                  Software & Subscriptions
                </Link>
              </li>
              <li>
                <Link href="/collections/fashion" className="text-muted-foreground hover:text-primary">
                  Fashion
                </Link>
              </li>
              <li>
                <Link href="/collections/lifestyle" className="text-muted-foreground hover:text-primary">
                  Lifestyle
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Help & Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/help-center" className="text-muted-foreground hover:text-primary">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="text-muted-foreground hover:text-primary">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/return-policy" className="text-muted-foreground hover:text-primary">
                  Return Policy
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-muted-foreground hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-conditions" className="text-muted-foreground hover:text-primary">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-12 pt-6 text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} Classyfyed. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}