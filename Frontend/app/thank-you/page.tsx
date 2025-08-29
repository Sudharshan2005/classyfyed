"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SocialIcon } from "react-social-icons"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function ThankYouPage() {

  return (
    <div className="container mx-auto py-10 px-4 max-w-[1200px]">
      <Link href="/" className="inline-flex items-center mb-8 text-sm font-medium text-blue-950">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Link>

      <Card className="mx-auto max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-blue-950">
            Thank You for Visiting Classyfyed!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-center text-muted-foreground">
            We appreciate your interest in Classyfyed. Connect with us on social media to stay updated!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <SocialIcon
              bgColor="transparent"
              fgColor="blue"
              network="telegram"
              style={{ width: "2rem", height: "2rem" }}
              className="w-8 h-8 sm:w-10 sm:h-10"
              onClick={() => window.open("https://t.me/classyfyed", "_blank", "noopener,noreferrer")}
            />
            <SocialIcon
              bgColor="transparent"
              fgColor="blue"
              network="instagram"
              style={{ width: "2rem", height: "2rem" }}
              className="w-8 h-8 sm:w-10 sm:h-10"
              onClick={() => window.open("https://www.instagram.com/classyfyed.in/", "_blank", "noopener,noreferrer")}
            />
            <SocialIcon
              bgColor="transparent"
              fgColor="blue"
              network="facebook"
              style={{ width: "2rem", height: "2rem" }}
              className="w-8 h-8 sm:w-10 sm:h-10"
              onClick={() => window.open("https://www.facebook.com/classyfyed.in/", "_blank", "noopener,noreferrer")}
            />
            <SocialIcon
              bgColor="transparent"
              fgColor="blue"
              network="whatsapp"
              style={{ width: "2rem", height: "2rem" }}
              className="w-8 h-8 sm:w-10 sm:h-10"
              onClick={() => window.open("https://whatsapp.com/channel/0029Vb7xJATJpe8jQSk5dQ1f", "_blank", "noopener,noreferrer")}
            />
            <SocialIcon
              bgColor="transparent"
              fgColor="blue"
              network="twitter"
              style={{ width: "2rem", height: "2rem" }}
              className="w-8 h-8 sm:w-10 sm:h-10"
              onClick={() => window.open("https://x.com/_Classyfyed", "_blank", "noopener,noreferrer")}
            />
            <SocialIcon
              bgColor="transparent"
              fgColor="blue"
              network="youtube"
              style={{ width: "2rem", height: "2rem" }}
              className="w-8 h-8 sm:w-10 sm:h-10"
              onClick={() => window.open("https://www.youtube.com/channel/UC5X542lwTzQPN1qMbcdnXMg", "_blank", "noopener,noreferrer")}
            />
            <SocialIcon
              bgColor="transparent"
              fgColor="blue"
              network="reddit"
              style={{ width: "2rem", height: "2rem" }}
              className="w-8 h-8 sm:w-10 sm:h-10"
              onClick={() => window.open("https://www.reddit.com/user/classyfyed/", "_blank", "noopener,noreferrer")}
            />
          </div>
          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Your email has been verified. Please return to the registration form and click the <strong>“Refresh”</strong> button to check your email verification status.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}