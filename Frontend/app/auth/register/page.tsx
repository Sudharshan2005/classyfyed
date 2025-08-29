"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, CheckCircle, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { SocialIcon } from "react-social-icons"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const institutes = [
  { id: "inst_1", name: "A. D. Patel Institute of Technology" },
]

function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const [hasError, setHasError] = useState(false)
  if (hasError) {
    return <div className="text-red-600 text-center">Error rendering form. Check console for details.</div>
  }
  try {
    return children
  } catch (error) {
    console.error("Error in RegisterPage:", error)
    setHasError(true)
    return null
  }
}

export default function RegisterPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [role, setRole] = useState("STUDENT")
  const [step, setStep] = useState(1)
  const [mobileError, setMobileError] = useState("")
  const [emailError, setEmailError] = useState("")
  const [isTncDialogOpen, setIsTncDialogOpen] = useState(true)
  const [verificationStatus, setVerificationStatus] = useState("idle")
  const [verificationError, setVerificationError] = useState("")
  const [isInstituteDropdownOpen, setIsInstituteDropdownOpen] = useState(false)
  const [filteredInstitutes, setFilteredInstitutes] = useState(institutes)
  const [isLoading, setIsLoading] = useState(false)
  const [isChecking, setIsChecking] = useState(false)
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

  const [formData, setFormData] = useState({
    institute: "",
    name: "",
    instituteId: "",
    mobile: "",
    email: "",
    gender: "",
    dob: "",
    stream: "",
    branch: "",
    currentYear: "",
    passoutYear: "",
    idCardFront: "",
    idCardBack: "",
    driveLink: "",
  })

  useEffect(() => {
    console.log("Current verificationStatus:", verificationStatus)
  }, [verificationStatus])

  useEffect(() => {
    if (!formData.email) {
      setVerificationStatus("idle")
      setVerificationError("")
    }
  }, [formData.email])

  const validateMobile = (mobile: string) => {
    const regex = /^\d{10}$/
    if (!regex.test(mobile)) {
      setMobileError("Please enter a valid 10-digit mobile number")
      return false
    }
    setMobileError("")
    return true
  }

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!regex.test(email)) {
      setEmailError("Please enter a valid email address")
      return false
    }
    setEmailError("")
    return true
  }

  const handleSendVerificationLink = async () => {
    if (!validateEmail(formData.email)) {
      console.error("RegisterPage - Invalid email for verification")
      setVerificationStatus("idle")
      toast({
        variant: "destructive",
        title: "Invalid Email",
        description: "Please enter a valid email address.",
      })
      return
    }
    setIsLoading(true)
    try {
      const response = await fetch(`/api/send-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, name: formData.name }),
      })
      const data = await response.json()
      if (data.success) {
        setVerificationStatus("sent")
        setVerificationError("")
        toast({
          title: "Verification Email Sent",
          description: "Check your inbox (and spam folder) for the verification link.",
        })
      } else {
        setVerificationStatus("error")
        setVerificationError(data.message || "Failed to send verification link")
        toast({
          variant: "destructive",
          title: "Failed to Send Verification",
          description: data.message || "Failed to send verification link.",
        })
        console.error("RegisterPage - Verification error:", data.message || "Failed to send verification link")
      }
    } catch (error) {
      console.error("RegisterPage - Error sending verification link:", error)
      setVerificationStatus("error")
      setVerificationError("Network error while sending verification link")
      toast({
        variant: "destructive",
        title: "Network Error",
        description: "Failed to send verification link due to a network issue.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCheckVerification = async () => {
    setIsChecking(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const response = await fetch(`/api/check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      })
      const data = await response.json()
      if (data.success) {
        setVerificationStatus("verified")
        setVerificationError("")
        toast({
          title: "Email Verified",
          description: "Your email has been successfully verified.",
        })
      } else {
        setVerificationStatus("error")
        setVerificationError(data.message || "Email not verified yet")
        toast({
          variant: "destructive",
          title: "Verification Pending",
          description: data.message || "Please click the verification link in your email.",
        })
        console.error("RegisterPage - Verification check failed:", data.message || "Email not verified yet")
      }
    } catch (error) {
      console.error("RegisterPage - Error checking verification:", error)
      setVerificationStatus("error")
      setVerificationError("Error checking verification status")
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to check verification status.",
      })
    } finally {
      setIsChecking(false)
    }
  }

  const handleNextStep = () => {
    if (verificationStatus !== "verified") {
      console.error("RegisterPage - Email not verified")
      toast({
        variant: "destructive",
        title: "Email Not Verified",
        description: "Please verify your email before proceeding.",
      })
      return
    }
    if (!validateMobile(formData.mobile) || !validateEmail(formData.email)) {
      console.error("RegisterPage - Invalid mobile or email")
      toast({
        variant: "destructive",
        title: "Invalid Input",
        description: "Please enter a valid mobile number and email address.",
      })
      return
    }
    setStep(step + 1)
  }

  const handlePrevStep = () => {
    setStep(step - 1)
  }

  interface InputChangeEvent extends React.ChangeEvent<HTMLInputElement> {
    target: HTMLInputElement & { id: keyof typeof formData; value: string }
  }

  const handleInputChange = (e: InputChangeEvent) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
    if (id === "institute") {
      const filtered = institutes.filter((inst) =>
        inst.name.toLowerCase().includes(value.toLowerCase())
      )
      setFilteredInstitutes(filtered)
      setIsInstituteDropdownOpen(value.length >= 3 && filtered.length > 0)
    }
    if (id === "mobile") {
      validateMobile(value)
    }
    if (id === "email") {
      validateEmail(value)
      setVerificationStatus("idle")
      setVerificationError("")
    }
  }

  const handleInstituteSelect = (institute: string) => {
    setFormData((prev) => ({ ...prev, institute }))
    setIsInstituteDropdownOpen(false)
  }

  interface HandleSelectChange {
    (key: keyof typeof formData): (value: string) => void
  }

  const handleSelectChange: HandleSelectChange = (key) => (value) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!validateMobile(formData.mobile) || !validateEmail(formData.email)) {
      console.error("RegisterPage - Invalid mobile number or email")
      toast({
        variant: "destructive",
        title: "Invalid Input",
        description: "Please enter a valid mobile number and email address.",
      })
      return
    }
    if (!formData.institute || !formData.name || !formData.instituteId || !formData.email || !formData.idCardFront || !formData.idCardBack) {
      toast({
        variant: "destructive",
        title: "Missing Fields",
        description: "Please fill in all required fields.",
      })
      return
    }
    if (role === "STUDENT" && (!formData.stream || !formData.branch || !formData.currentYear || !formData.passoutYear)) {
      console.error("RegisterPage - Missing student-specific fields")
      toast({
        variant: "destructive",
        title: "Missing Fields",
        description: "Please fill in all student-specific fields.",
      })
      return
    }
    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, role }),
      })
      const data = await response.json()
      if (data.success) {
        toast({
          title: "Registration Successful",
          description: "Redirecting to login page.",
        })
        router.push("/auth/login")
      } else {
        console.error("RegisterPage - Registration failed:", data.message)
        toast({
          variant: "destructive",
          title: "Registration Failed",
          description: data.message || "Failed to register.",
        })
      }
    } catch (error) {
      console.error("RegisterPage - Error submitting form:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit registration form.",
      })
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-[1200px]">
      <Link href="/" className="inline-flex items-center mb-8 text-sm font-medium text-blue-950">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Link>

      <div className="mx-auto max-w-2xl">
        <ErrorBoundary>
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2 text-blue-950">Create Your Account</h1>
            <p className="text-blue-950">Join thousands of students enjoying exclusive discounts</p>
          </div>

          <Card className="shadow-md border border-gray-200">
            <CardHeader>
              <CardTitle className="text-blue-950">Register as Student or Faculty</CardTitle>
              <CardDescription className="text-blue-950">Create an account to access exclusive student discounts</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent>
                {step === 1 && (
                  <div className="space-y-4">
                    <div className="space-y-2 relative">
                      <Label htmlFor="institute" className="text-blue-950">Institute Name</Label>
                      <Input
                        id="institute"
                        placeholder="Enter your institute name"
                        className="block focus:ring-2 focus:ring-blue-500 placeholder-blue-950"
                        value={formData.institute}
                        onChange={handleInputChange}
                        onFocus={() => {
                          if (formData.institute.length >= 3) {
                            const filtered = institutes.filter((inst) =>
                              inst.name.toLowerCase().includes(formData.institute.toLowerCase())
                            )
                            setFilteredInstitutes(filtered)
                            setIsInstituteDropdownOpen(filtered.length > 0)
                          }
                        }}
                        onBlur={() => {
                          setTimeout(() => setIsInstituteDropdownOpen(false), 200)
                        }}
                      />
                      {isInstituteDropdownOpen && (
                        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                          {filteredInstitutes.length > 0 ? (
                            filteredInstitutes.map((inst) => (
                              <div
                                key={inst.id}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-blue-950"
                                onMouseDown={() => handleInstituteSelect(inst.name)}
                              >
                                {inst.name}
                              </div>
                            ))
                          ) : (
                            <div className="px-4 py-2 text-sm text-blue-950">
                              No matching institutes
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-blue-950">Role</Label>
                      <RadioGroup defaultValue="STUDENT" onValueChange={setRole}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="STUDENT" id="student" />
                          <Label htmlFor="student" className="text-blue-950">Student</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="FACULTY" id="faculty" />
                          <Label htmlFor="faculty" className="text-blue-950">Faculty / Staff</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-blue-950">Full Name (as per college ID)</Label>
                      <Input
                        id="name"
                        placeholder="Enter your full name"
                        className="block focus:ring-2 focus:ring-blue-500 placeholder-blue-950"
                        value={formData.name}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="instituteId" className="text-blue-950">{role === "STUDENT" ? "Institute Roll Number" : "Employee ID"}</Label>
                      <Input
                        id="instituteId"
                        placeholder={role === "STUDENT" ? "Enter your roll number" : "Enter your employee ID"}
                        className="block focus:ring-2 focus:ring-blue-500 placeholder-blue-950"
                        value={formData.instituteId}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mobile" className="text-blue-950">Mobile Number</Label>
                      <div className="flex-1">
                        <Input
                          id="mobile"
                          placeholder="Enter your 10-digit mobile number"
                          className="block focus:ring-2 focus:ring-blue-500 placeholder-blue-950"
                          value={formData.mobile}
                          onChange={handleInputChange}
                        />
                        {mobileError && (
                          <p className="text-red-600 text-sm mt-1">{mobileError}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-blue-950">Email Address</Label>
                      <div className="flex-1">
                        <Input
                          id="email"
                          placeholder="Enter your email address"
                          className="block focus:ring-2 focus:ring-blue-500 placeholder-blue-950"
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                        {emailError && (
                          <p className="text-red-600 text-sm mt-1">{emailError}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2" data-verification-status={verificationStatus}>
                      <Label className="text-blue-950">Email Verification</Label>
                      {verificationStatus === "idle" && (
                        <Button
                          onClick={handleSendVerificationLink}
                          disabled={!formData.email || !!emailError || isLoading}
                          className="bg-blue-950 text-white hover:bg-blue-800 disabled:bg-blue-500 disabled:cursor-not-allowed"
                        >
                          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          {isLoading ? "Sending..." : "Send Verification Link"}
                        </Button>
                      )}
                      {verificationStatus === "sent" && (
                        <Button
                          onClick={handleCheckVerification}
                          disabled={isChecking}
                          className="bg-blue-950 text-white hover:bg-blue-800 disabled:bg-blue-500 disabled:cursor-not-allowed"
                        >
                          {isChecking && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          {isChecking ? "Checking..." : "Refresh"}
                        </Button>
                      )}
                      {verificationStatus === "verified" && (
                        <div className="flex items-center">
                          <CheckCircle className="w-5 h-5 mr-1 text-green-600" />
                          <p className="text-green-600 text-sm">Verified Successfully</p>
                        </div>
                      )}
                      {verificationStatus === "error" && (
                        <div className="space-y-2">
                          <p className="text-red-600 text-sm">{verificationError || "Email not verified yet"}</p>
                          <Button
                            onClick={handleSendVerificationLink}
                            disabled={isLoading}
                            className="bg-blue-950 text-white hover:bg-blue-800 disabled:bg-blue-500 disabled:cursor-not-allowed"
                          >
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isLoading ? "Sending..." : "Retry"}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="gender" className="text-blue-950">Gender</Label>
                      <Select onValueChange={handleSelectChange("gender")}>
                        <SelectTrigger className="text-blue-950">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male" className="text-blue-950">Male</SelectItem>
                          <SelectItem value="female" className="text-blue-950">Female</SelectItem>
                          <SelectItem value="other" className="text-blue-950">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dob" className="text-blue-950">Date of Birth</Label>
                      <Input
                        id="dob"
                        type="date"
                        className="block focus:ring-2 focus:ring-blue-500 text-blue-950"
                        value={formData.dob}
                        onChange={handleInputChange}
                      />
                    </div>

                    {role === "STUDENT" && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="stream" className="text-blue-950">Stream</Label>
                          <Select onValueChange={handleSelectChange("stream")}>
                            <SelectTrigger className="text-blue-950">
                              <SelectValue placeholder="Select stream" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="engineering" className="text-blue-950">Engineering</SelectItem>
                              <SelectItem value="science" className="text-blue-950">Science</SelectItem>
                              <SelectItem value="arts" className="text-blue-950">Arts</SelectItem>
                              <SelectItem value="commerce" className="text-blue-950">Commerce</SelectItem>
                              <SelectItem value="medicine" className="text-blue-950">Medicine</SelectItem>
                              <SelectItem value="other" className="text-blue-950">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="branch" className="text-blue-950">Branch</Label>
                          <Input
                            id="branch"
                            placeholder="Enter your branch"
                            className="block focus:ring-2 focus:ring-blue-500 placeholder-blue-950"
                            value={formData.branch}
                            onChange={handleInputChange}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="currentYear" className="text-blue-950">Current Year of Study</Label>
                          <Select onValueChange={handleSelectChange("currentYear")}>
                            <SelectTrigger className="text-blue-950">
                              <SelectValue placeholder="Select year" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1" className="text-blue-950">1st Year</SelectItem>
                              <SelectItem value="2" className="text-blue-950">2nd Year</SelectItem>
                              <SelectItem value="3" className="text-blue-950">3rd Year</SelectItem>
                              <SelectItem value="4" className="text-blue-950">4th Year</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="passoutYear" className="text-blue-950">Passout Year</Label>
                          <Select onValueChange={handleSelectChange("passoutYear")}>
                            <SelectTrigger className="text-blue-950">
                              <SelectValue placeholder="Select passout year" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 10 }, (_, i) => {
                                const year = new Date().getFullYear() + i
                                return (
                                  <SelectItem key={year} value={year.toString()} className="text-blue-950">
                                    {year}
                                  </SelectItem>
                                )
                              })}
                            </SelectContent>
                          </Select>
                        </div>
                      </>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="idCardFront" className="text-blue-950">ID Card Front (Google Drive Link)</Label>
                      <Input
                        id="idCardFront"
                        placeholder="Enter Google Drive link for ID card front"
                        className="block focus:ring-2 focus:ring-blue-500 placeholder-blue-950"
                        value={formData.idCardFront}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="idCardBack" className="text-blue-950">ID Card Back (Google Drive Link)</Label>
                      <Input
                        id="idCardBack"
                        placeholder="Enter Google Drive link for ID card back"
                        className="block focus:ring-2 focus:ring-blue-500 placeholder-blue-950"
                        value={formData.idCardBack}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="driveLink" className="text-blue-950">Additional Google Drive Link (Optional)</Label>
                      <Input
                        id="driveLink"
                        placeholder="Enter additional Google Drive link"
                        className="block focus:ring-2 focus:ring-blue-500 placeholder-blue-950"
                        value={formData.driveLink}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between mt-4">
                {step === 1 ? (
                  <div className="flex w-full justify-between">
                    <Button asChild className="bg-blue-950 text-white hover:bg-blue-800 disabled:bg-blue-500 disabled:cursor-not-allowed">
                      <Link href="/auth/login">Already have an account? Sign In</Link>
                    </Button>
                    <Button
                      onClick={handleNextStep}
                      disabled={verificationStatus !== "verified" || !formData.institute || !formData.email || !!mobileError || !!emailError}
                      className="bg-blue-950 text-white hover:bg-blue-800 disabled:bg-blue-500 disabled:cursor-not-allowed"
                    >
                      Next
                    </Button>
                  </div>
                ) : (
                  <div className="flex w-full justify-between">
                    <Button
                      variant="outline"
                      onClick={handlePrevStep}
                      className="bg-blue-950 text-white hover:bg-blue-800 border-blue-500 disabled:bg-blue-500 disabled:cursor-not-allowed"
                    >
                      Previous
                    </Button>
                    <Button
                      type="submit"
                      disabled={
                        !formData.institute ||
                        !formData.email ||
                        !formData.idCardFront ||
                        !formData.idCardBack ||
                        !!mobileError ||
                        !!emailError ||
                        isLoading
                      }
                      className="bg-blue-950 text-white hover:bg-blue-800 disabled:bg-blue-500 disabled:cursor-not-allowed"
                    >
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {isLoading ? "Registersing..." : "Register"}
                    </Button>
                  </div>
                )}
              </CardFooter>
            </form>
          </Card>
        </ErrorBoundary>
      </div>

      <Dialog open={isTncDialogOpen} onOpenChange={setIsTncDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader className="relative">
            <DialogTitle className="text-lg text-blue-950">Terms and Conditions</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <ul className="list-disc pl-5 text-sm text-blue-950 space-y-2">
              <li>Above 12 Years of Age</li>
              <li>From a School, College or University Recognised by Central or State Governments of India</li>
              <li>T&C are subject to change with the brand choice</li>
            </ul>
            <div className="flex flex-wrap gap-2">
              <SocialIcon
                bgColor="transparent"
                fgColor="blue"
                network="telegram"
                style={{ width: '2rem', height: '2rem' }}
                className="w-6 h-6 sm:w-8 sm:h-8"
                onClick={() => window.open('https://t.me/classyfyed', '_blank', 'noopener,noreferrer')}
              />
              <SocialIcon
                bgColor="transparent"
                fgColor="blue"
                network="instagram"
                style={{ width: '2rem', height: '2rem' }}
                className="w-6 h-6 sm:w-8 sm:h-8"
                onClick={() => window.open('https://www.instagram.com/classyfyed.in/', '_blank', 'noopener,noreferrer')}
              />
              <SocialIcon
                bgColor="transparent"
                fgColor="blue"
                network="facebook"
                style={{ width: '2rem', height: '2rem' }}
                className="w-6 h-6 sm:w-8 sm:h-8"
                onClick={() => window.open('https://www.facebook.com/classyfyed.in/', '_blank', 'noopener,noreferrer')}
              />
              <SocialIcon
                bgColor="transparent"
                fgColor="blue"
                network="whatsapp"
                style={{ width: '2rem', height: '2rem' }}
                className="w-6 h-6 sm:w-8 sm:h-8"
                onClick={() => window.open('https://whatsapp.com/channel/0029Vb7xJATJpe8jQSk5dQ1f', '_blank', 'noopener,noreferrer')}
              />
              <SocialIcon
                bgColor="transparent"
                fgColor="blue"
                network="twitter"
                style={{ width: '2rem', height: '2rem' }}
                className="w-6 h-6 sm:w-8 sm:h-8"
                onClick={() => window.open('https://x.com/_Classyfyed', '_blank', 'noopener,noreferrer')}
              />
              <SocialIcon
                bgColor="transparent"
                fgColor="blue"
                network="youtube"
                style={{ width: '2rem', height: '2rem' }}
                className="w-6 h-6 sm:w-8 sm:h-8"
                onClick={() => window.open('https://www.youtube.com/channel/UC5X542lwTzQPN1qMbcdnXMg', '_blank', 'noopener,noreferrer')}
              />
              <SocialIcon
                bgColor="transparent"
                fgColor="blue"
                network="reddit"
                style={{ width: '2rem', height: '2rem' }}
                className="w-6 h-6 sm:w-8 sm:h-8"
                onClick={() => window.open('https://www.reddit.com/user/classyfyed/', '_blank', 'noopener,noreferrer')}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}