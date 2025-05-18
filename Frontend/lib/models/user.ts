export interface User {
  id: string
  name: string
  email: string
  mobile: string
  role: "STUDENT" | "FACULTY" | "ADMIN" | "VENDOR"
  verified: boolean
  institute?: string
  rollNo?: string
  employeeId?: string
  businessName?: string
  createdAt: Date
  updatedAt: Date
}

export interface StudentDetails {
  stream?: string
  branch?: string
  currentYear?: number
  passoutYear?: number
  gender?: string
  dob?: Date
  idCardUrl?: string
}

export interface VendorDetails {
  businessType?: string
  category?: string
  address?: string
  city?: string
  state?: string
  pincode?: string
  country?: string
  gstNumber?: string
  panNumber?: string
  bankDetails?: {
    bankName: string
    accountNumber: string
    ifscCode: string
    accountHolderName: string
  }
}

// Mock user database
const users: (User & { password: string } & { studentDetails?: StudentDetails } & { vendorDetails?: VendorDetails })[] =
  [
    {
      id: "usr_1",
      name: "Admin User",
      email: "admin@studentdiscount.com",
      mobile: "9876543210",
      role: "ADMIN",
      verified: true,
      password: "admin123", // In a real app, this would be hashed
      createdAt: new Date("2023-01-01"),
      updatedAt: new Date("2023-01-01"),
    },
    {
      id: "usr_2",
      name: "Rahul Sharma",
      email: "rahul@example.com",
      mobile: "9876543211",
      role: "STUDENT",
      verified: true,
      institute: "Delhi Technical University",
      rollNo: "DTU/2021/CS/123",
      password: "student123", // In a real app, this would be hashed
      createdAt: new Date("2023-02-15"),
      updatedAt: new Date("2023-02-15"),
      studentDetails: {
        stream: "Engineering",
        branch: "Computer Science",
        currentYear: 3,
        passoutYear: 2025,
        gender: "Male",
        dob: new Date("2000-05-10"),
        idCardUrl: "https://example.com/id-cards/rahul.jpg",
      },
    },
    {
      id: "usr_3",
      name: "TechGadgets India",
      email: "contact@techgadgets.com",
      mobile: "9876543212",
      role: "VENDOR",
      verified: true,
      businessName: "TechGadgets India",
      password: "vendor123", // In a real app, this would be hashed
      createdAt: new Date("2023-03-20"),
      updatedAt: new Date("2023-03-20"),
      vendorDetails: {
        businessType: "LLC",
        category: "Electronics",
        address: "123 Tech Park, Phase 2",
        city: "Bangalore",
        state: "Karnataka",
        pincode: "560001",
        country: "India",
        gstNumber: "29ABCDE1234F1Z5",
        panNumber: "ABCDE1234F",
        bankDetails: {
          bankName: "HDFC Bank",
          accountNumber: "12345678901234",
          ifscCode: "HDFC0001234",
          accountHolderName: "TechGadgets India",
        },
      },
    },
  ]

// Mock user model functions
export const UserModel = {
  findById: async (id: string) => {
    const user = users.find((u) => u.id === id)
    if (!user) return null

    // Don't return the password
    const { password, ...userWithoutPassword } = user
    return userWithoutPassword
  },

  findByEmail: async (email: string) => {
    const user = users.find((u) => u.email === email)
    if (!user) return null

    // Don't return the password
    const { password, ...userWithoutPassword } = user
    return userWithoutPassword
  },

  findByMobile: async (mobile: string) => {
    const user = users.find((u) => u.mobile === mobile)
    if (!user) return null

    // Don't return the password
    const { password, ...userWithoutPassword } = user
    return userWithoutPassword
  },

  create: async (userData: Partial<User>) => {
    const newUser = {
      id: `usr_${users.length + 1}`,
      ...userData,
      verified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      password: "defaultpassword", // In a real app, this would be hashed
    } as User & { password: string }

    users.push(newUser)

    // Don't return the password
    const { password, ...userWithoutPassword } = newUser
    return userWithoutPassword
  },

  update: async (id: string, userData: Partial<User>) => {
    const userIndex = users.findIndex((u) => u.id === id)
    if (userIndex === -1) return null

    users[userIndex] = {
      ...users[userIndex],
      ...userData,
      updatedAt: new Date(),
    }

    // Don't return the password
    const { password, ...userWithoutPassword } = users[userIndex]
    return userWithoutPassword
  },

  verifyCredentials: async (email: string, password: string) => {
    const user = users.find((u) => u.email === email && u.password === password)
    if (!user) return null

    // Don't return the password
    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword
  },
}
