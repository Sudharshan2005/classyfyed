module.exports = {

"[project]/.next-internal/server/app/api/vendor/products/route/actions.js [app-rsc] (server actions loader, ecmascript)": (function(__turbopack_context__) {

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
"[project]/models/Vendor.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
;
// 2. Schema definition
const VendorSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"]({
    businessName: {
        type: String,
        required: [
            true,
            'Business name is required'
        ],
        trim: true
    },
    businessType: {
        type: String,
        required: [
            true,
            'Business type is required'
        ],
        enum: [
            'individual',
            'partnership',
            'llc',
            'corporation'
        ]
    },
    businessCategory: {
        type: String,
        required: [
            true,
            'Business category is required'
        ],
        enum: [
            'electronics',
            'books',
            'software',
            'fashion',
            'lifestyle'
        ]
    },
    contactName: {
        type: String,
        required: [
            true,
            'Contact person name is required'
        ],
        trim: true
    },
    email: {
        type: String,
        required: [
            true,
            'Business email is required'
        ],
        unique: true,
        trim: true,
        match: [
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            'Please enter a valid email'
        ]
    },
    mobile: {
        type: String,
        required: [
            true,
            'Mobile number is required'
        ],
        unique: true,
        trim: true,
        match: [
            /^\d{10}$/,
            'Please enter a valid 10-digit mobile number'
        ]
    },
    address: {
        type: String,
        required: [
            true,
            'Business address is required'
        ],
        trim: true
    },
    city: {
        type: String,
        required: [
            true,
            'City is required'
        ],
        trim: true
    },
    state: {
        type: String,
        required: [
            true,
            'State is required'
        ],
        trim: true
    },
    pincode: {
        type: String,
        required: [
            true,
            'Pincode is required'
        ],
        trim: true,
        match: [
            /^\d{6}$/,
            'Please enter a valid 6-digit pincode'
        ]
    },
    country: {
        type: String,
        required: [
            true,
            'Country is required'
        ],
        trim: true,
        default: 'India'
    },
    gst: {
        type: String,
        trim: true,
        match: [
            /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$|^$/,
            'Please enter a valid GST number or leave empty'
        ],
        default: ''
    },
    pan: {
        type: String,
        required: [
            true,
            'PAN number is required'
        ],
        trim: true,
        match: [
            /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
            'Please enter a valid PAN number'
        ]
    },
    bankName: {
        type: String,
        required: [
            true,
            'Bank name is required'
        ],
        trim: true
    },
    accountNumber: {
        type: String,
        required: [
            true,
            'Account number is required'
        ],
        trim: true
    },
    ifsc: {
        type: String,
        required: [
            true,
            'IFSC code is required'
        ],
        trim: true,
        match: [
            /^[A-Z]{4}0[A-Z0-9]{6}$/,
            'Please enter a valid IFSC code'
        ]
    },
    accountHolder: {
        type: String,
        required: [
            true,
            'Account holder name is required'
        ],
        trim: true
    },
    password: {
        type: String,
        required: [
            true,
            'Password is required'
        ],
        minlength: [
            8,
            'Password must be at least 8 characters'
        ]
    },
    isVerified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});
// 3. Prevent recompilation in dev mode
const Vendor = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["models"].Vendor || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].model('Vendor', VendorSchema);
const __TURBOPACK__default__export__ = Vendor;
}}),
"[project]/app/api/vendor/products/route.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "GET": (()=>GET)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/mongodb.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Product$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/models/Product.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Vendor$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/models/Vendor.ts [app-route] (ecmascript)");
;
;
;
;
async function GET(req) {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectToDB"])();
        const email = req.nextUrl.searchParams.get("email");
        if (!email) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                message: "Vendor email is required"
            }, {
                status: 400
            });
        }
        const vendor = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Vendor$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findOne({
            email
        }).lean();
        if (!vendor) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                message: "Vendor not found"
            }, {
                status: 404
            });
        }
        const products = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Product$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].find({
            vendorId: vendor._id
        }).lean();
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            products
        }, {
            status: 200
        });
    } catch (error) {
        console.error("Fetch products by vendor error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            message: "Internal server error"
        }, {
            status: 500
        });
    }
}
}}),

};

//# sourceMappingURL=%5Broot%20of%20the%20server%5D__0719b415._.js.map