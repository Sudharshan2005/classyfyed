module.exports = {

"[project]/.next-internal/server/app/api/vendor/login/route/actions.js [app-rsc] (server actions loader, ecmascript)": (function(__turbopack_context__) {

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
"[project]/app/api/vendor/login/route.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "POST": (()=>POST)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/bcryptjs/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/mongodb.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Vendor$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/models/Vendor.ts [app-route] (ecmascript)");
;
;
;
;
async function POST(req) {
    try {
        // Connect to MongoDB
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectToDB"])();
        // Parse request body
        const { email, password } = await req.json();
        // Validate input
        if (!email || !password) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                message: "Email and password are required"
            }, {
                status: 400
            });
        }
        // Find user by email
        const user = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Vendor$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findOne({
            email
        });
        if (!user) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                message: "Invalid email or password"
            }, {
                status: 401
            });
        }
        // Compare password
        const isPasswordValid = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].compare(password, user.password);
        if (!isPasswordValid) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                message: "Invalid email or password"
            }, {
                status: 401
            });
        }
        // Optional: Check if user is verified
        if (!user.isVerified) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                message: "Account not verified"
            }, {
                status: 403
            });
        }
        // Return success response with user data (excluding password)
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            message: "Login successful"
        }, {
            status: 200
        });
    } catch (error) {
        if (error instanceof Error) {
            console.error("Login error:", error.message);
        } else {
            console.error("Login error:", error);
        }
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

//# sourceMappingURL=%5Broot%20of%20the%20server%5D__ce73495e._.js.map