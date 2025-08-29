import { NextResponse } from "next/server"
import { verify } from "jsonwebtoken"
import Admin from "@/models/Admin"
import { connectToDB } from "@/lib/mongodb"

interface JwtPayload {
  email: string
}

async function authenticateToken(request: Request): Promise<{ email: string | null; error: string | null }> {
  const authHeader = request.headers.get("Authorization")
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { email: null, error: "No token provided" }
  }

  const token = authHeader.replace("Bearer ", "")
  try {
    const decoded = verify(token, process.env.JWT_SECRET || "5vvgj23hbz") as JwtPayload
    return { email: decoded.email, error: null }
  } catch (error) {
    console.error("JWT Verification Error:", error)
    return { email: null, error: "Invalid token" }
  }
}

export async function GET(request: Request) {
  try {
    await connectToDB()

    const { email, error } = await authenticateToken(request)
    if (!email || error) {
      return NextResponse.json({ success: false, message: error || "Unauthorized" }, { status: 401 })
    }

    const user = await Admin.find({ userId: email })
    if (!user) {
      return NextResponse.json({ success: false, message: "Vendor not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, user })
  } catch (error) {
    console.error("Profile API Error:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch profile" }, { status: 500 })
  }
}