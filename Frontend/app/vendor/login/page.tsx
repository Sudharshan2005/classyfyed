"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function VendorLoginPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <Link href="/" className="inline-flex items-center mb-8 text-sm font-medium">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Link>

      <div className="mx-auto max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Vendor Login</h1>
          <p className="text-muted-foreground">Sign in to manage your products and orders</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Vendor Login</CardTitle>
            <CardDescription>Enter your credentials to access your vendor account</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email or Mobile</Label>
                <Input id="email" placeholder="Enter your email or mobile" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="Enter your password" />
              </div>
              <div className="text-right">
                <Link href="/vendor/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button className="w-full">Sign In</Button>
            <div className="text-center text-sm">
              Don&apos;t have a vendor account?{" "}
              <Link href="/vendor/register" className="text-primary hover:underline">
                Register now
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
