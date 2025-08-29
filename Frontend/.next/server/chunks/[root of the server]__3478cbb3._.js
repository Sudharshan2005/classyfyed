module.exports = {

"[project]/.next-internal/server/app/api/vendor/profile/route/actions.js [app-rsc] (server actions loader, ecmascript)": (function(__turbopack_context__) {

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
"[externals]/buffer [external] (buffer, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}}),
"[externals]/stream [external] (stream, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}}),
"[externals]/util [external] (util, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}}),
"[externals]/crypto [external] (crypto, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}}),
"[externals]/mongoose [external] (mongoose, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("mongoose", () => require("mongoose"));

module.exports = mod;
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
"[project]/app/api/vendor/profile/route.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "GET": (()=>GET)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jsonwebtoken/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Vendor$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/models/Vendor.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/mongodb.ts [app-route] (ecmascript)");
;
;
;
;
async function authenticateToken(request) {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return {
            email: null,
            error: "No token provided"
        };
    }
    const token = authHeader.replace("Bearer ", "");
    try {
        const decoded = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["verify"])(token, process.env.JWT_SECRET || "5vvgj23hbz");
        return {
            email: decoded.email,
            error: null
        };
    } catch (error) {
        console.error("JWT Verification Error:", error);
        return {
            email: null,
            error: "Invalid token"
        };
    }
}
async function GET(request) {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectToDB"])();
        const { email, error } = await authenticateToken(request);
        if (!email || error) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                message: error || "Unauthorized"
            }, {
                status: 401
            });
        }
        const user = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Vendor$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].find({
            email
        });
        if (!user) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                message: "Vendor not found"
            }, {
                status: 404
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            user
        });
    } catch (error) {
        console.error("Profile API Error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            message: "Failed to fetch profile"
        }, {
            status: 500
        });
    }
}
}}),

};

//# sourceMappingURL=%5Broot%20of%20the%20server%5D__3478cbb3._.js.map