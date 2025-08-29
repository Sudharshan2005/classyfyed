module.exports = {

"[project]/.next-internal/server/app/api/product/search/route/actions.js [app-rsc] (server actions loader, ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
}}),
"[externals]/next/dist/compiled/next-server/app-route.runtime.dev.js [external] (next/dist/compiled/next-server/app-route.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/@opentelemetry/api [external] (@opentelemetry/api, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("@opentelemetry/api", () => require("@opentelemetry/api"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/next-server/app-page.runtime.dev.js [external] (next/dist/compiled/next-server/app-page.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/mongoose [external] (mongoose, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("mongoose", () => require("mongoose"));

module.exports = mod;
}}),
"[project]/models/Product.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
;
const variantSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"]({
    key: {
        type: String,
        required: true
    },
    value: {
        type: String,
        required: true
    }
}, {
    _id: false
});
const reviewSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"]({
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    }
}, {
    _id: false
});
const productSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"]({
    images: [
        {
            type: String,
            required: true
        }
    ],
    brandName: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    genericName: {
        type: String,
        required: true
    },
    originalPrice: {
        type: Number,
        required: true
    },
    discountPrice: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    subCategory: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        default: 0
    },
    sales: {
        type: Number,
        default: 0
    },
    productModel: {
        type: String
    },
    color: {
        type: String
    },
    weight: {
        type: String
    },
    variants: [
        variantSchema
    ],
    description: {
        type: String
    },
    reviews: [
        reviewSchema
    ],
    status: {
        type: String,
        enum: [
            'active',
            'inactive'
        ],
        default: 'inactive'
    },
    vendorId: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].Schema.Types.ObjectId,
        ref: 'Vendor',
        required: true
    }
}, {
    timestamps: true
});
const ProductModel = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].models.Product || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].model('Product', productSchema);
const __TURBOPACK__default__export__ = ProductModel;
}}),
"[project]/lib/mongodb.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "connectToDB": (()=>connectToDB)
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
;
const MONGODB_URI = ("TURBOPACK compile-time value", "mongodb+srv://classyfyedin:wGAmD3XtJprQeQli@classyfyed.tuqtj3w.mongodb.net/classyfyed?retryWrites=true&w=majority&appName=classyfyed");
if ("TURBOPACK compile-time falsy", 0) {
    "TURBOPACK unreachable";
}
let isConnected = false;
const connectToDB = async ()=>{
    if (isConnected) return;
    try {
        await __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].connect(MONGODB_URI);
        isConnected = true;
        console.log('✅ Connected to MongoDB');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        throw error;
    }
};
}}),
"[project]/app/api/product/search/route.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "GET": (()=>GET)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Product$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/models/Product.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/mongodb.ts [app-route] (ecmascript)");
;
;
;
async function GET(request) {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectToDB"])();
        const url = new URL(request.url);
        const searchParams = url.searchParams;
        const query = searchParams.get("q") || "";
        const category = searchParams.get("category") || "";
        const minPrice = searchParams.get("minPrice") ? parseFloat(searchParams.get("minPrice")) : null;
        const maxPrice = searchParams.get("maxPrice") ? parseFloat(searchParams.get("maxPrice")) : null;
        const brands = searchParams.get("brands")?.split(",").filter(Boolean) || [];
        const subCategories = searchParams.get("subCategories")?.split(",").filter(Boolean) || [];
        const priceRanges = searchParams.get("priceRanges")?.split(",").filter(Boolean) || [];
        const discounts = searchParams.get("discounts")?.split(",").filter(Boolean) || [];
        const ratings = searchParams.get("ratings")?.split(",").filter(Boolean) || [];
        // Build MongoDB query with explicit type
        const mongoQuery = {
            status: "active"
        };
        if (query) {
            mongoQuery.genericName = {
                $regex: query,
                $options: "i"
            };
        }
        if (category) {
            mongoQuery.category = category.replace(/-/g, " ");
        }
        if (minPrice !== null) {
            mongoQuery.discountPrice = {
                ...mongoQuery.discountPrice,
                $gte: minPrice
            };
        }
        if (maxPrice !== null) {
            mongoQuery.discountPrice = {
                ...mongoQuery.discountPrice,
                $lte: maxPrice
            };
        }
        if (brands.length) {
            mongoQuery.brandName = {
                $in: brands
            };
        }
        if (subCategories.length) {
            mongoQuery.subCategory = {
                $in: subCategories
            };
        }
        // Combine price, discount, and rating filters
        const combinedFilters = [];
        if (priceRanges.length) {
            const priceFilters = priceRanges.map((id)=>{
                if (id === "price-1") return {
                    discountPrice: {
                        $gte: 0,
                        $lte: 1000
                    }
                };
                if (id === "price-2") return {
                    discountPrice: {
                        $gte: 1000,
                        $lte: 5000
                    }
                };
                if (id === "price-3") return {
                    discountPrice: {
                        $gte: 5000,
                        $lte: 10000
                    }
                };
                if (id === "price-4") return {
                    discountPrice: {
                        $gte: 10000,
                        $lte: 20000
                    }
                };
                if (id === "price-5") return {
                    discountPrice: {
                        $gte: 20000
                    }
                };
                return {};
            }).filter((f)=>Object.keys(f).length > 0);
            combinedFilters.push(...priceFilters);
        }
        if (discounts.length) {
            const discountFilters = discounts.map((id)=>{
                const minDiscount = parseInt(id.replace("discount-", ""));
                return {
                    $expr: {
                        $gte: [
                            {
                                $divide: [
                                    {
                                        $subtract: [
                                            "$originalPrice",
                                            "$discountPrice"
                                        ]
                                    },
                                    "$originalPrice"
                                ]
                            },
                            minDiscount / 100
                        ]
                    }
                };
            });
            combinedFilters.push(...discountFilters);
        }
        if (ratings.length) {
            const ratingFilters = ratings.map((id)=>{
                const minRating = parseInt(id.replace("rating-", ""));
                return {
                    $expr: {
                        $gte: [
                            {
                                $avg: "$reviews.rating"
                            },
                            minRating
                        ]
                    }
                };
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
        const products = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Product$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].find(mongoQuery).lean();
        // Generate dynamic filters
        const uniqueBrands = Array.from(new Set(products.map((p)=>p.brandName))).filter(Boolean).map((name, index)=>({
                id: `brand-${index + 1}`,
                name
            }));
        const uniqueSubCategories = Array.from(new Set(products.map((p)=>p.subCategory))).filter(Boolean).map((name, index)=>({
                id: `subcategory-${index + 1}`,
                name
            }));
        const filters = {
            brands: uniqueBrands,
            subCategories: uniqueSubCategories,
            priceRanges: [
                {
                    id: "price-1",
                    name: "Under ₹1,000",
                    min: 0,
                    max: 1000
                },
                {
                    id: "price-2",
                    name: "₹1,000 - ₹5,000",
                    min: 1000,
                    max: 5000
                },
                {
                    id: "price-3",
                    name: "₹5,000 - ₹10,000",
                    min: 5000,
                    max: 10000
                },
                {
                    id: "price-4",
                    name: "₹10,000 - ₹20,000",
                    min: 10000,
                    max: 20000
                },
                {
                    id: "price-5",
                    name: "Above ₹20,000",
                    min: 20000,
                    max: Infinity
                }
            ],
            discounts: [
                {
                    id: "discount-1",
                    name: "10% or more",
                    min: 10
                },
                {
                    id: "discount-2",
                    name: "25% or more",
                    min: 25
                },
                {
                    id: "discount-3",
                    name: "50% or more",
                    min: 50
                },
                {
                    id: "discount-4",
                    name: "60% or more",
                    min: 60
                },
                {
                    id: "discount-5",
                    name: "75% or more",
                    min: 75
                }
            ],
            ratings: [
                {
                    id: "rating-4",
                    name: "4★ & above",
                    min: 4
                },
                {
                    id: "rating-3",
                    name: "3★ & above",
                    min: 3
                },
                {
                    id: "rating-2",
                    name: "2★ & above",
                    min: 2
                },
                {
                    id: "rating-1",
                    name: "1★ & above",
                    min: 1
                }
            ]
        };
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            products,
            filters
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        if (error instanceof TypeError && error.message.includes("Failed to parse URL")) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Invalid URL format"
            }, {
                status: 400
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to fetch products"
        }, {
            status: 500
        });
    }
}
}}),

};

//# sourceMappingURL=%5Broot%20of%20the%20server%5D__5773022c._.js.map