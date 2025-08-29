"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SocialIcon } from "react-social-icons"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function OrderSuccessPage() {
  const router = useRouter()
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (countdown <= 0) {
      router.push('/user/dashboard')
    }
  }, [countdown, router])

  return (
    <div className="container mx-auto py-10 px-4 max-w-[1200px]">
      <Link href="/user/dashboard" className="inline-flex items-center mb-8 text-sm font-medium text-blue-950">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Link>

      <Card className="mx-auto max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-blue-950">
            Order Placed Successfully!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center mb-6">
            <div className="relative w-24 h-24">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path
                  className="circle-bg"
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#e5e5e5"
                  strokeWidth="3"
                />
                <path
                  className="circle"
                  strokeDasharray="100"
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="3"
                />
                <path
                  className="tick"
                  d="M10 18 l5 5 l10 -10"
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
          <style>{`
            .circle {
              animation: circle 1s ease forwards;
              stroke-dashoffset: 100;
            }
            .tick {
              animation: tick 0.5s ease forwards 0.5s;
              stroke-dasharray: 30;
              stroke-dashoffset: 30;
            }
            @keyframes circle {
              to {
                stroke-dashoffset: 0;
              }
            }
            @keyframes tick {
              to {
                stroke-dashoffset: 0;
              }
            }
          `}</style>
          <p className="text-center text-muted-foreground">
            Your order has been placed successfully. Thank you for shopping with Classyfyed!
          </p>
          <p className="text-center text-muted-foreground">
            You will be automatically redirected to the home page in{" "}
            <span className="font-bold text-blue-950">{countdown}</span> second{countdown !== 1 ? 's' : ''}...
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
        </CardContent>
      </Card>
    </div>
  )
}