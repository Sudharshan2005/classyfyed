"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"

export default function VendorLoginPage() {
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [isSigningIn, setIsSigningIn] = useState<boolean>(false)
  const router = useRouter()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSigningIn(true)
    setError("")

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await response.json()
      console.log("AdminLoginPage - Sign-in response:", data)

      if (!data.success) {
        setError(data.message || "Login failed")
        return
      }

      if (data.token) {
        localStorage.setItem("token", data.token)
      }
      console.log("AdminLoginPage - Login successful for email:", email)
      setError("")
      router.push("/admin/dashboard")
    } catch (err) {
      console.error("AdminLoginPage - Error signing in:", err)
      setError("Error signing in. Please try again.")
    } finally {
      setIsSigningIn(false)
    }
  }

  return (
    <div className="container mx-auto py-10 px-4 text-blue-950">
      <Link href="/" className="inline-flex items-center mb-8 text-sm font-medium">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Link>

      <div className="mx-auto max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Admin Login</h1>
          <p className="text-muted-foreground">Sign in to manage users, products and orders</p>
        </div>

        <Card className="text-blue-950">
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>Enter your credentials to access your admin account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignIn} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full bg-blue-950"
              onClick={handleSignIn}
              disabled={isSigningIn}
            >
              {isSigningIn ? "Signing In..." : "Sign In"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}