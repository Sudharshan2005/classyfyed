"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

export default function VendorRegisterPage() {
  const [otpSent, setOtpSent] = useState(false)
  const [step, setStep] = useState(1)
  const BASE_URL=process.env.NEXT_PUBLIC_BASE_URL
  const [formData, setFormData] = useState({
    businessName: "",
    businessType: "",
    businessCategory: "",
    contactName: "",
    email: "",
    mobile: "",
    otp: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    gst: "",
    pan: "",
    bankName: "",
    accountNumber: "",
    ifsc: "",
    accountHolder: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<Errors>({})
  const { toast } = useToast()
  const router = useRouter()

  interface FormData {
    businessName: string;
    businessType: string;
    businessCategory: string;
    contactName: string;
    email: string;
    mobile: string;
    otp: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
    gst: string;
    pan: string;
    bankName: string;
    accountNumber: string;
    ifsc: string;
    accountHolder: string;
    password: string;
    confirmPassword: string;
  }

  interface Errors {
    [key: string]: string | null;
  }

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Errors = {};
    if (currentStep === 1) {
      if (!formData.businessName) newErrors.businessName = "Business name is required";
      if (!formData.businessType) newErrors.businessType = "Business type is required";
      if (!formData.businessCategory) newErrors.businessCategory = "Business category is required";
      if (!formData.contactName) newErrors.contactName = "Contact person name is required";
      // if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      //   newErrors.email = "Please enter a valid email";
      // }
      if (!formData.mobile || !/^\d{10}$/.test(formData.mobile)) {
        newErrors.mobile = "Please enter a valid 10-digit mobile number";
      }
      if (otpSent && (!formData.otp || formData.otp !== "1234")) {
        newErrors.otp = "Invalid OTP";
      }
    } else if (currentStep === 2) {
      if (!formData.address) newErrors.address = "Business address is required";
      if (!formData.city) newErrors.city = "City is required";
      if (!formData.state) newErrors.state = "State is required";
      if (!formData.pincode || !/^\d{6}$/.test(formData.pincode)) {
        newErrors.pincode = "Please enter a valid 6-digit pincode";
      }
      if (!formData.country) newErrors.country = "Country is required";
      // if (formData.gst && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(formData.gst)) {
      //   newErrors.gst = "Please enter a valid GST number or leave empty";
      // }
      // if (!formData.pan || !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pan)) {
      //   newErrors.pan = "Please enter a valid PAN number";
      // }
    } else if (currentStep === 3) {
      if (!formData.bankName) newErrors.bankName = "Bank name is required";
      if (!formData.accountNumber) newErrors.accountNumber = "Account number is required";
      // if (!formData.ifsc || !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifsc)) {
      //   newErrors.ifsc = "Please enter a valid IFSC code";
      // }
      if (!formData.accountHolder) newErrors.accountHolder = "Account holder name is required";
      if (!formData.password || formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, name, value } = e.target
    const key = name || id // Use name if available, fallback to id
    console.log(`Input change: ${key} = ${value}`)
    setFormData((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: null }))
    }
  }

  const handleInputFocus = (id: string) => {
    console.log(`Input focused: ${id}`)
  }

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    console.log(`Key down on ${e.currentTarget.id}: ${e.key}`)
  }

  const handleSelectChange = (field: keyof FormData, value: string) => {
    console.log(`Select change: ${field} = ${value}`)
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }))
    }
  }

  const handleSendOtp = () => {
    if (!/^\d{10}$/.test(formData.mobile)) {
      setErrors((prev) => ({ ...prev, mobile: "Please enter a valid 10-digit mobile number" }))
      return
    }
    setOtpSent(true)
    toast({
      title: "OTP Sent",
      description: "Please enter the OTP '1234' for testing.",
    })
  }

  const handleNextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1)
    }
  }

  const handlePrevStep = () => {
    setStep(step - 1)
    setErrors({})
  }

  const handleSubmit = async () => {
    if (!validateStep(3)) return

    try {
      const response = await fetch(`${BASE_URL}/api/vendor/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const data = await response.json()
      if (data.success) {
        toast({
          title: "Registration Successful",
          description: "Vendor registered successfully, awaiting verification.",
        })
        router.push("/vendor/login")
      } else {
        toast({
          variant: "destructive",
          title: "Registration Failed",
          description: data.message || "An error occurred during registration.",
        })
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to connect to the server. Please try again.",
      })
    }
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <Link href="/" className="inline-flex items-center mb-8 text-sm font-medium text-primary">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Link>

      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Become a Vendor</h1>
          <p className="text-muted-foreground">Register to sell your products on our platform</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Vendor Registration</CardTitle>
            <CardDescription>Complete the form to register as a vendor (Step {step} of 3)</CardDescription>
          </CardHeader>
          <CardContent>
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input
                    id="businessName"
                    name="businessName"
                    type="text"
                    autoComplete="organization"
                    placeholder="Enter your business name"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    onFocus={() => handleInputFocus("businessName")}
                    onKeyDown={handleInputKeyDown}
                  />
                  {errors.businessName && <p className="text-red-500 text-sm">{errors.businessName}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="business-type">Business Type</Label>
                  <Select
                    onValueChange={(value) => handleSelectChange("businessType", value)}
                    value={formData.businessType}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select business type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">Individual</SelectItem>
                      <SelectItem value="partnership">Partnership</SelectItem>
                      <SelectItem value="llc">LLC</SelectItem>
                      <SelectItem value="corporation">Corporation</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.businessType && <p className="text-red-500 text-sm">{errors.businessType}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="business-category">Primary Business Category</Label>
                  <Select
                    onValueChange={(value) => handleSelectChange("businessCategory", value)}
                    value={formData.businessCategory}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="books">Books & Stationery</SelectItem>
                      <SelectItem value="software">Software & Subscriptions</SelectItem>
                      <SelectItem value="fashion">Fashion</SelectItem>
                      <SelectItem value="lifestyle">Lifestyle</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.businessCategory && <p className="text-red-500 text-sm">{errors.businessCategory}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactName">Contact Person Name</Label>
                  <Input
                    id="contactName"
                    name="contactName"
                    type="text"
                    autoComplete="name"
                    placeholder="Enter contact person name"
                    value={formData.contactName}
                    onChange={handleInputChange}
                    onFocus={() => handleInputFocus("contactName")}
                    onKeyDown={handleInputKeyDown}
                  />
                  {errors.contactName && <p className="text-red-500 text-sm">{errors.contactName}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Business Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="Enter business email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onFocus={() => handleInputFocus("email")}
                    onKeyDown={handleInputKeyDown}
                  />
                  {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mobile">Mobile Number</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="mobile"
                      name="mobile"
                      type="tel"
                      autoComplete="tel"
                      placeholder="Enter mobile number"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      onFocus={() => handleInputFocus("mobile")}
                      onKeyDown={handleInputKeyDown}
                      pattern="\d{10}"
                    />
                    <Button onClick={handleSendOtp} disabled={otpSent}>
                      {otpSent ? "Sent" : "Send OTP"}
                    </Button>
                  </div>
                  {errors.mobile && <p className="text-red-500 text-sm">{errors.mobile}</p>}
                </div>

                {otpSent && (
                  <div className="space-y-2">
                    <Label htmlFor="otp">OTP Verification</Label>
                    <Input
                      id="otp"
                      name="otp"
                      type="text"
                      placeholder="Enter OTP sent to your mobile"
                      value={formData.otp}
                      onChange={handleInputChange}
                      onFocus={() => handleInputFocus("otp")}
                      onKeyDown={handleInputKeyDown}
                    />
                    {errors.otp && <p className="text-red-500 text-sm">{errors.otp}</p>}
                  </div>
                )}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Business Address</Label>
                  <Textarea
                    id="address"
                    name="address"
                    autoComplete="street-address"
                    placeholder="Enter your business address"
                    value={formData.address}
                    onChange={handleInputChange}
                    onFocus={() => handleInputFocus("address")}
                    onKeyDown={handleInputKeyDown}
                  />
                  {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      type="text"
                      autoComplete="address-level2"
                      placeholder="Enter city"
                      value={formData.city}
                      onChange={handleInputChange}
                      onFocus={() => handleInputFocus("city")}
                      onKeyDown={handleInputKeyDown}
                    />
                    {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      name="state"
                      type="text"
                      autoComplete="address-level1"
                      placeholder="Enter state"
                      value={formData.state}
                      onChange={handleInputChange}
                      onFocus={() => handleInputFocus("state")}
                      onKeyDown={handleInputKeyDown}
                    />
                    {errors.state && <p className="text-red-500 text-sm">{errors.state}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input
                      id="pincode"
                      name="pincode"
                      type="text"
                      autoComplete="postal-code"
                      placeholder="Enter pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      onFocus={() => handleInputFocus("pincode")}
                      onKeyDown={handleInputKeyDown}
                    />
                    {errors.pincode && <p className="text-red-500 text-sm">{errors.pincode}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      name="country"
                      type="text"
                      autoComplete="country-name"
                      placeholder="Enter country"
                      value={formData.country}
                      onChange={handleInputChange}
                      onFocus={() => handleInputFocus("country")}
                      onKeyDown={handleInputKeyDown}
                    />
                    {errors.country && <p className="text-red-500 text-sm">{errors.country}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gst">GST Number (if applicable)</Label>
                  <Input
                    id="gst"
                    name="gst"
                    type="text"
                    placeholder="Enter GST number"
                    value={formData.gst}
                    onChange={handleInputChange}
                    onFocus={() => handleInputFocus("gst")}
                    onKeyDown={handleInputKeyDown}
                  />
                  {errors.gst && <p className="text-red-500 text-sm">{errors.gst}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pan">PAN Number</Label>
                  <Input
                    id="pan"
                    name="pan"
                    type="text"
                    placeholder="Enter PAN number"
                    value={formData.pan}
                    onChange={handleInputChange}
                    onFocus={() => handleInputFocus("pan")}
                    onKeyDown={handleInputKeyDown}
                  />
                  {errors.pan && <p className="text-red-500 text-sm">{errors.pan}</p>}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input
                    id="bankName"
                    name="bankName"
                    type="text"
                    placeholder="Enter bank name"
                    value={formData.bankName}
                    onChange={handleInputChange}
                    onFocus={() => handleInputFocus("bankName")}
                    onKeyDown={handleInputKeyDown}
                  />
                  {errors.bankName && <p className="text-red-500 text-sm">{errors.bankName}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input
                    id="accountNumber"
                    name="accountNumber"
                    type="text"
                    placeholder="Enter account number"
                    value={formData.accountNumber}
                    onChange={handleInputChange}
                    onFocus={() => handleInputFocus("accountNumber")}
                    onKeyDown={handleInputKeyDown}
                  />
                  {errors.accountNumber && <p className="text-red-500 text-sm">{errors.accountNumber}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ifsc">IFSC Code</Label>
                  <Input
                    id="ifsc"
                    name="ifsc"
                    type="text"
                    placeholder="Enter IFSC code"
                    value={formData.ifsc}
                    onChange={handleInputChange}
                    onFocus={() => handleInputFocus("ifsc")}
                    onKeyDown={handleInputKeyDown}
                  />
                  {errors.ifsc && <p className="text-red-500 text-sm">{errors.ifsc}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accountHolder">Account Holder Name</Label>
                  <Input
                    id="accountHolder"
                    name="accountHolder"
                    type="text"
                    placeholder="Enter account holder name"
                    value={formData.accountHolder}
                    onChange={handleInputChange}
                    onFocus={() => handleInputFocus("accountHolder")}
                    onKeyDown={handleInputKeyDown}
                  />
                  {errors.accountHolder && <p className="text-red-500 text-sm">{errors.accountHolder}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Create Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleInputChange}
                    onFocus={() => handleInputFocus("password")}
                    onKeyDown={handleInputKeyDown}
                  />
                  {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    onFocus={() => handleInputFocus("confirmPassword")}
                    onKeyDown={handleInputKeyDown}
                  />
                  {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            {step === 1 ? (
              <div className="flex w-full justify-between">
                <Button variant="outline" asChild>
                  <Link href="/vendor/login">Already a vendor? Sign In</Link>
                </Button>
                <Button onClick={handleNextStep} disabled={!otpSent}>
                  Next
                </Button>
              </div>
            ) : step === 3 ? (
              <div className="flex w-full justify-between">
                <Button variant="outline" onClick={handlePrevStep}>
                  Previous
                </Button>
                <Button onClick={handleSubmit}>Register as Vendor</Button>
              </div>
            ) : (
              <div className="flex w-full justify-between">
                <Button variant="outline" onClick={handlePrevStep}>
                  Previous
                </Button>
                <Button onClick={handleNextStep}>Next</Button>
              </div>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}