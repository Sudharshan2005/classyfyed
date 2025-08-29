import { NextResponse } from "next/server";
import ProductModel, { IProduct } from "@/models/Product";
import { connectToDB } from "@/lib/mongodb";
import mongoose from "mongoose";

export async function GET(request: Request) {
  try {
    await connectToDB();

    const url = new URL(request.url);
    const searchParams = url.searchParams;

    const query = searchParams.get("q") || "";
    const category = searchParams.get("category") || "";
    const minPrice = searchParams.get("minPrice") ? parseFloat(searchParams.get("minPrice")!) : null;
    const maxPrice = searchParams.get("maxPrice") ? parseFloat(searchParams.get("maxPrice")!) : null;
    const brands = searchParams.get("brands")?.split(",").filter(Boolean) || [];
    const subCategories = searchParams.get("subCategories")?.split(",").filter(Boolean) || [];
    const priceRanges = searchParams.get("priceRanges")?.split(",").filter(Boolean) || [];
    const discounts = searchParams.get("discounts")?.split(",").filter(Boolean) || [];
    const ratings = searchParams.get("ratings")?.split(",").filter(Boolean) || [];

    // Build MongoDB query with explicit type
    const mongoQuery: mongoose.FilterQuery<IProduct> = { status: "active" };
    if (query) {
      mongoQuery.genericName = { $regex: query, $options: "i" };
    }
    if (category) {
      mongoQuery.category = category.replace(/-/g, " ");
    }
    if (minPrice !== null) {
      mongoQuery.discountPrice = { ...mongoQuery.discountPrice, $gte: minPrice };
    }
    if (maxPrice !== null) {
      mongoQuery.discountPrice = { ...mongoQuery.discountPrice, $lte: maxPrice };
    }
    if (brands.length) {
      mongoQuery.brandName = { $in: brands };
    }
    if (subCategories.length) {
      mongoQuery.subCategory = { $in: subCategories };
    }

    // Combine price, discount, and rating filters
    const combinedFilters: mongoose.FilterQuery<IProduct>[] = [];

    if (priceRanges.length) {
      const priceFilters = priceRanges.map((id) => {
        if (id === "price-1") return { discountPrice: { $gte: 0, $lte: 1000 } };
        if (id === "price-2") return { discountPrice: { $gte: 1000, $lte: 5000 } };
        if (id === "price-3") return { discountPrice: { $gte: 5000, $lte: 10000 } };
        if (id === "price-4") return { discountPrice: { $gte: 10000, $lte: 20000 } };
        if (id === "price-5") return { discountPrice: { $gte: 20000 } };
        return {};
      }).filter((f) => Object.keys(f).length > 0);
      combinedFilters.push(...priceFilters);
    }

    if (discounts.length) {
      const discountFilters = discounts.map((id) => {
        const minDiscount = parseInt(id.replace("discount-", ""));
        return {
          $expr: {
            $gte: [
              { $divide: [{ $subtract: ["$originalPrice", "$discountPrice"] }, "$originalPrice"] },
              minDiscount / 100,
            ],
          },
        } as mongoose.FilterQuery<IProduct>;
      });
      combinedFilters.push(...discountFilters);
    }

    if (ratings.length) {
      const ratingFilters = ratings.map((id) => {
        const minRating = parseInt(id.replace("rating-", ""));
        return {
          $expr: {
            $gte: [
              { $avg: "$reviews.rating" },
              minRating,
            ],
          },
        } as mongoose.FilterQuery<IProduct>;
      });
      combinedFilters.push(...ratingFilters);
    }

    // Apply combined filters with $and if multiple filter types are present
    if (combinedFilters.length > 0) {
      if (combinedFilters.length === 1) {
        Object.assign(mongoQuery, combinedFilters[0]);
      } else {
        mongoQuery.$and = combinedFilters;
      }
    }

    const products = await ProductModel.find(mongoQuery).lean();

    // Generate dynamic filters
    const uniqueBrands = Array.from(new Set(products.map((p) => p.brandName)))
      .filter(Boolean)
      .map((name, index) => ({
        id: `brand-${index + 1}`,
        name,
      }));
    const uniqueSubCategories = Array.from(new Set(products.map((p) => p.subCategory)))
      .filter(Boolean)
      .map((name, index) => ({
        id: `subcategory-${index + 1}`,
        name,
      }));

    const filters = {
      brands: uniqueBrands,
      subCategories: uniqueSubCategories,
      priceRanges: [
        { id: "price-1", name: "Under ₹1,000", min: 0, max: 1000 },
        { id: "price-2", name: "₹1,000 - ₹5,000", min: 1000, max: 5000 },
        { id: "price-3", name: "₹5,000 - ₹10,000", min: 5000, max: 10000 },
        { id: "price-4", name: "₹10,000 - ₹20,000", min: 10000, max: 20000 },
        { id: "price-5", name: "Above ₹20,000", min: 20000, max: Infinity },
      ],
      discounts: [
        { id: "discount-1", name: "10% or more", min: 10 },
        { id: "discount-2", name: "25% or more", min: 25 },
        { id: "discount-3", name: "50% or more", min: 50 },
        { id: "discount-4", name: "60% or more", min: 60 },
        { id: "discount-5", name: "75% or more", min: 75 },
      ],
      ratings: [
        { id: "rating-4", name: "4★ & above", min: 4 },
        { id: "rating-3", name: "3★ & above", min: 3 },
        { id: "rating-2", name: "2★ & above", min: 2 },
        { id: "rating-1", name: "1★ & above", min: 1 },
      ],
    };

    return NextResponse.json({ products, filters });
  } catch (error) {
    console.error("Error fetching products:", error);
    if (error instanceof TypeError && error.message.includes("Failed to parse URL")) {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}