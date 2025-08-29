"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

export default function LoginPage() {
  const [otpSent, setOtpSent] = useState<boolean>(false)
  const [email, setEmail] = useState<string>("")
  const [otp, setOtp] = useState<string>("")
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const [dialogMessage, setDialogMessage] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [isSendingOtp, setIsSendingOtp] = useState<boolean>(false)
  const [isSigningIn, setIsSigningIn] = useState<boolean>(false)
  const router = useRouter()
  const otpInputs = useRef<HTMLInputElement[]>(Array(4).fill(null))

  useEffect(() => {
    console.log("Current otpSent:", otpSent)
  }, [otpSent])

  const handleSendOtp = async () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address")
      setOtpSent(false)
      return
    }

    setIsSendingOtp(true)
    try {
      const response = await fetch(`/api/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await response.json()
      console.log("LoginPage - Fetched user by email:", data)

      if (!data.success) {
        setDialogMessage("User not registered or rejected")
        setDialogOpen(true)
        setOtpSent(false)
        return
      }

      setOtpSent(true)
      setError("")
      console.log("LoginPage - OTP sent (hardcoded: 1234)")
    } catch (err) {
      console.error("LoginPage - Error fetching user:", err)
      setError("Error checking user status")
      setOtpSent(false)
    } finally {
      setIsSendingOtp(false)
    }
  }

  const handleSignIn = async () => {
    setIsSigningIn(true)
    try {
      const response = await fetch(`/api/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      })
      const data = await response.json()
      console.log("LoginPage - Sign-in response:", data)

      if (!data.success) {
        setError(data.message || "Login failed")
        return
      }

      localStorage.setItem("token", data.token)
      console.log("LoginPage - Login successful for email:", email)
      setError("")
      router.push("/user/dashboard")
    } catch (err) {
      console.error("LoginPage - Error signing in:", err)
      setError("Error signing in")
    } finally {
      setIsSigningIn(false)
    }
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value)
    setError("")
    setOtpSent(false)
    setOtp("")
  }

  const handleOtpDigitChange = (index: number, value: string) => {
    if (value.length > 1 || (value && !/^[0-9]$/.test(value))) return

    const newOtp = otp.split("")
    newOtp[index] = value
    setOtp(newOtp.join(""))
    setError("")

    if (value && index < 3 && otpInputs.current[index + 1]) {
      otpInputs.current[index + 1].focus()
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0 && otpInputs.current[index - 1]) {
      otpInputs.current[index - 1].focus()
    }
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-[1200px]">
      <Link
        href="/"
        className="inline-flex items-center mb-8 text-sm font-medium text-blue-950 hover:text-primary"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back To Home
      </Link>

      <div className="mx-auto max-w-md">
        <Card className="shadow-md border border-gray-200">
          <CardHeader>
            <CardTitle className="text-blue-950">Student / Faculty Login</CardTitle>
            <CardDescription className="text-blue-950">Sign in with your Email</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-blue-950">Email</Label>
                <div className="flex space-x-2">
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your registered email"
                    value={email}
                    onChange={handleEmailChange}
                    className="focus:ring-2 focus:ring-blue-500 placeholder-blue-950"
                    title="Please enter a valid email address"
                  />
                  <Button
                    onClick={handleSendOtp}
                    disabled={isSendingOtp || (otpSent && !error)}
                    className="bg-blue-950 text-white hover:bg-blue-800 disabled:bg-blue-950 disabled:cursor-not-allowed"
                  >
                    {isSendingOtp ? "Sending..." : otpSent ? "Resend" : "Send OTP"}
                  </Button>
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
              </div>

              {otpSent && (
                <div className="space-y-2">
                  <Label className="text-blue-950">OTP Verification</Label>
                  <div className="flex space-x-2">
                    {[0, 1, 2, 3].map((index) => (
                      <Input
                        key={index}
                        ref={(el: HTMLInputElement | null) => {
                          if (el) {
                            otpInputs.current[index] = el
                          }
                        }}
                        className="w-12 text-center focus:ring-2 focus:ring-blue-500 text-blue-950 placeholder-blue-950"
                        maxLength={1}
                        value={otp[index] || ""}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleOtpDigitChange(index, e.target.value)}
                        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => handleOtpKeyDown(index, e)}
                        placeholder="-"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              className="w-full bg-blue-950 text-white hover:bg-blue-800 disabled:bg-blue-950 disabled:cursor-not-allowed"
              disabled={otp.length !== 4 || isSigningIn}
              onClick={handleSignIn}
            >
              {isSigningIn ? "Signing..." : "Sign In"}
            </Button>
            <div className="text-center text-sm text-blue-950">
              Don&apos;t have an account?{" "}
              <Link href="/auth/register" className="text-blue-950 hover:text-primary hover:underline">
                Register Now
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-blue-950">Verification Status</DialogTitle>
            <DialogDescription className="text-blue-950">{dialogMessage}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => setDialogOpen(false)}
              className="bg-blue-500 text-white hover:bg-blue-600"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}