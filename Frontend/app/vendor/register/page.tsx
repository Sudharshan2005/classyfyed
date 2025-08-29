"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function VendorRegisterPage() {
  const [otpSent, setOtpSent] = useState(false);
  const [step, setStep] = useState(1);
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "";
  const [formData, setFormData] = useState({
    businessName: "",
    businessType: "",
    businessCategory: "",
    contactName: "",
    email: "",
    mobile: "",
    otp: ["", "", "", ""],
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
  });
  const [errors, setErrors] = useState<Errors>({});
  const { toast } = useToast();
  const router = useRouter();

  interface FormData {
    businessName: string;
    businessType: string;
    businessCategory: string;
    contactName: string;
    email: string;
    mobile: string;
    otp: string[];
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
      if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Please enter a valid email";
      }
      if (!formData.mobile || !/^\d{10}$/.test(formData.mobile)) {
        newErrors.mobile = "Please enter a valid 10-digit mobile number";
      }
      if (otpSent && formData.otp.some((digit) => !/^\d$/.test(digit))) {
        newErrors.otp = "Please enter a valid 4-digit OTP";
      }
    } else if (currentStep === 2) {
      if (!formData.address) newErrors.address = "Business address is required";
      if (!formData.city) newErrors.city = "City is required";
      if (!formData.state) newErrors.state = "State is required";
      if (!formData.pincode || !/^\d{6}$/.test(formData.pincode)) {
        newErrors.pincode = "Please enter a valid 6-digit pincode";
      }
      if (!formData.country) newErrors.country = "Country is required";
    } else if (currentStep === 3) {
      if (!formData.bankName) newErrors.bankName = "Bank name is required";
      if (!formData.accountNumber) newErrors.accountNumber = "Account number is required";
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
    const { id, name, value } = e.target;
    const key = name || id;
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: null }));
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (/^\d?$/.test(value)) { // Allow single digit or empty
      const newOtp = [...formData.otp];
      newOtp[index] = value;
      setFormData((prev) => ({ ...prev, otp: newOtp }));
      if (errors.otp) {
        setErrors((prev) => ({ ...prev, otp: null }));
      }
      // Auto-focus next input
      if (value && index < 3) {
        document.getElementById(`otp-${index + 1}`)?.focus();
      }
    }
  };

  const handleInputFocus = (id: string) => {
    console.log(`Input focused: ${id}`);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>, index?: number) => {
    console.log(`Key down on ${e.currentTarget.id}: ${e.key}`);
    if (index !== undefined && e.key === "Backspace" && !formData.otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleSelectChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleSendOtp = async () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrors((prev) => ({ ...prev, email: "Please enter a valid email" }));
      return;
    }

    try {
      const response = await fetch(`/api/vendor/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });
      const data = await response.json();
      console.log(data)
      if (data.success) {
        setOtpSent(true);
        toast({
          title: "OTP Sent",
          description: "Please check your email for the 4-digit OTP.",
        });
      } else {
        setErrors((prev) => ({ ...prev, email: data.message || "Failed to send OTP" }));
        toast({
          variant: "destructive",
          title: "Error",
          description: data.message || "Failed to send OTP",
        });
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      setErrors((prev) => ({ ...prev, email: "Failed to connect to the server" }));
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to connect to the server. Please try again.",
      });
    }
  };

  const handleVerifyOtp = async () => {
    if (formData.otp.some((digit) => !/^\d$/.test(digit))) {
      setErrors((prev) => ({ ...prev, otp: "Please enter a valid 4-digit OTP" }));
      return false;
    }

    try {
      const response = await fetch(`/api/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otp: formData.otp.join("") }),
      });
      const data = await response.json();
      if (data.success) {
        return true;
      } else {
        setErrors((prev) => ({ ...prev, otp: data.message || "Invalid OTP" }));
        toast({
          variant: "destructive",
          title: "Error",
          description: data.message || "Invalid OTP",
        });
        return false;
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setErrors((prev) => ({ ...prev, otp: "Failed to verify OTP" }));
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to connect to the server. Please try again.",
      });
      return false;
    }
  };

  const handleNextStep = async () => {
    if (step === 1 && otpSent) {
      const isOtpValid = await handleVerifyOtp();
      if (!isOtpValid) return;
    }
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handlePrevStep = () => {
    setStep(step - 1);
    setErrors({});
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    try {
      const response = await fetch(`${BASE_URL}/api/vendor/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, otp: formData.otp.join("") }),
      });
      const data = await response.json();
      if (data.success) {
        toast({
          title: "Registration Successful",
          description: "Vendor registered successfully, awaiting verification.",
        });
        router.push("/vendor/login");
      } else {
        toast({
          variant: "destructive",
          title: "Registration Failed",
          description: data.message || "An error occurred during registration.",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to connect to the server. Please try again.",
      });
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 text-blue-950">
      <Link href="/" className="inline-flex items-center mb-8 text-sm font-medium text-blue-950">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Link>

      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Become a Vendor</h1>
          <p className="text-muted-foreground">Register to sell your products on our platform</p>
        </div>

        <Card className="text-blue-950">
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
                  <div className="flex space-x-2">
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
                    <Button className="bg-blue-950" onClick={handleSendOtp} disabled={otpSent}>
                      {otpSent ? "Resend OTP" : "Send OTP"}
                    </Button>
                  </div>
                  {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                </div>

                {otpSent && (
                  <div className="space-y-2">
                    <Label>OTP Verification</Label>
                    <div className="flex space-x-2">
                      {formData.otp.map((digit, index) => (
                        <Input
                          key={index}
                          id={`otp-${index}`}
                          type="text"
                          maxLength={1}
                          className="w-12 text-center"
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onFocus={() => handleInputFocus(`otp-${index}`)}
                          onKeyDown={(e) => handleInputKeyDown(e, index)}
                        />
                      ))}
                    </div>
                    {errors.otp && <p className="text-red-500 text-sm">{errors.otp}</p>}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="mobile">Mobile Number</Label>
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
                  {errors.mobile && <p className="text-red-500 text-sm">{errors.mobile}</p>}
                </div>
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
                <Button className="bg-blue-950" asChild>
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
  );
}