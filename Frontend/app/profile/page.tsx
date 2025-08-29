"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, UserRoundCheck } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

interface User {
  _id: string
  institute: string
  role: "STUDENT" | "FACULTY"
  name: string
  instituteId: string
  mobile: string
  email: string
  gender: string
  dob: string
  stream?: string
  branch?: string
  currentYear?: string
  passoutYear?: string
  idCardFront: string
  idCardBack: string
  driveLink?: string
  isVerified: boolean
  createdAt: string
  updatedAt: string
}

function toPascalCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/(^|\s)\w/g, (letter) => letter.toUpperCase())
    .replace(/Of/g, 'Of')
}

export default function ProfilePage() {
  const { toast } = useToast()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch("/api/user/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        const data = await response.json()
        if (data.success) {
          setUser(data.user[0])
          setLoading(false)
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: data.message || "Failed to fetch profile.",
          })
          router.push("/auth/login")
        }
      } catch (error) {
        console.error("ProfilePage - Error fetching profile:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch profile.",
        })
        router.push("/auth/login")
      }
    }

    fetchUserProfile()
  }, [toast, router])

  if (loading) {
    return (
      <div className="container mx-auto py-10 px-4 max-w-[1200px] text-blue-950">
        <p>Loading profile...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto py-10 px-4 max-w-[1200px] text-blue-950">
        <p>No profile data available.</p>
      </div>
    )
  }

  const formattedDob = new Date(parseInt(user.dob)).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const avatarChar = user.name.charAt(0).toUpperCase()

  return (
    <>
      <header>
        <Navbar />
      </header>
      <div className="container mx-auto py-10 px-4 max-w-[1200px]">
        <Link
          href="/user/dashboard"
          className="inline-flex items-center mb-8 text-sm font-medium text-blue-950 hover:text-primary"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back To Dashboard
        </Link>

        <Card className="max-w-2xl mx-auto shadow-md border border-gray-200">
          <CardHeader className="flex flex-col items-center space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-white text-xl font-bold">
              {avatarChar}
            </div>
            <div className="text-center">
              <div className="flex">
              <CardTitle className="text-lg font-semibold text-blue-950 mr-2">{user.name}</CardTitle>
              <UserRoundCheck className="w-5 text-green-600" />
              </div>
              <p className="text-sm text-blue-950">{toPascalCase(user.role)}</p>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="border-t pt-4">
                  <h3 className="text-base font-semibold text-blue-950">{toPascalCase("full name")}</h3>
                  <p className="text-base text-blue-950">{user.name}</p>
                </div>
                <div className="border-t pt-4">
                  <h3 className="text-base font-semibold text-blue-950">{toPascalCase("email")}</h3>
                  <p className="text-base text-blue-950">{user.email}</p>
                </div>
                <div className="border-t pt-4">
                  <h3 className="text-base font-semibold text-blue-950">{toPascalCase("mobile number")}</h3>
                  <p className="text-base text-blue-950">{user.mobile}</p>
                </div>
                <div className="border-t pt-4">
                  <h3 className="text-base font-semibold text-blue-950">{toPascalCase("institute")}</h3>
                  <p className="text-base text-blue-950">{user.institute}</p>
                </div>
                <div className="border-t pt-4">
                  <h3 className="text-base font-semibold text-blue-950">
                    {user.role === "STUDENT" ? toPascalCase("roll number") : toPascalCase("employee id")}
                  </h3>
                  <p className="text-base text-blue-950">{user.instituteId}</p>
                </div>
                <div className="border-t pt-4">
                  <h3 className="text-base font-semibold text-blue-950">{toPascalCase("role")}</h3>
                  <p className="text-base text-blue-950">{toPascalCase(user.role.toLowerCase())}</p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="border-t pt-4">
                  <h3 className="text-base font-semibold text-blue-950">{toPascalCase("gender")}</h3>
                  <p className="text-base text-blue-950">{toPascalCase(user.gender)}</p>
                </div>
                <div className="border-t pt-4">
                  <h3 className="text-base font-semibold text-blue-950">{toPascalCase("date of birth")}</h3>
                  <p className="text-base text-blue-950">{formattedDob}</p>
                </div>
                {user.role === "STUDENT" && (
                  <>
                    <div className="border-t pt-4">
                      <h3 className="text-base font-semibold text-blue-950">{toPascalCase("stream")}</h3>
                      <p className="text-base text-blue-950">{user.stream ? toPascalCase(user.stream) : "N/A"}</p>
                    </div>
                    <div className="border-t pt-4">
                      <h3 className="text-base font-semibold text-blue-950">{toPascalCase("branch")}</h3>
                      <p className="text-base text-blue-950">{user.branch ? toPascalCase(user.branch) : "N/A"}</p>
                    </div>
                  </>
                )}
                <div className="border-t pt-4">
                  <h3 className="text-base font-semibold text-blue-950">{toPascalCase("id card front")}</h3>
                  <a
                    href={user.idCardFront}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-950 hover:text-primary hover:underline"
                  >
                    View Id Card Front
                  </a>
                </div>
                <div className="border-t pt-4">
                  <h3 className="text-base font-semibold text-blue-950">{toPascalCase("id card back")}</h3>
                  <a
                    href={user.idCardBack}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-950 hover:text-primary hover:underline"
                  >
                    View Id Card Back
                  </a>
                </div>
                {user.driveLink && (
                  <div className="border-t pt-4">
                    <h3 className="text-base font-semibold text-blue-950">{toPascalCase("additional documents")}</h3>
                    <a
                      href={user.driveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-950 hover:text-primary hover:underline"
                    >
                      View Additional Documents
                    </a>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {user.passoutYear && (
          <Card className="max-w-2xl mx-auto mt-6 shadow-md border border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-blue-950">Account Validity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base text-blue-950">
                Your account is valid up to 
                <span className="font-semibold"> 31st December, {user.passoutYear}.</span>
              </p>
            </CardContent>
          </Card>
        )}
      </div>
      <footer>
        <Footer />
      </footer>
    </>
  )
}