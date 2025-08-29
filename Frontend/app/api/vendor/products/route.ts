import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import Vendor from "@/models/Vendor";
export async function GET(req: NextRequest) {
  try {
    await connectToDB();

    const email = req.nextUrl.searchParams.get("email");
    if (!email) {
      return NextResponse.json(
        { success: false, message: "Vendor email is required" },
        { status: 400 }
      );
    }

    const vendor = await Vendor.findOne({ email }).lean();
    if (!vendor) {
      return NextResponse.json(
        { success: false, message: "Vendor not found" },
        { status: 404 }
      );
    }

    const products = await Product.find({ vendorId: vendor._id }).lean();

    return NextResponse.json(
      { success: true, products },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fetch products by vendor error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
