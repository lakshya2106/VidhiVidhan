import mongoose from "mongoose"
const adminSchema = new mongoose.Schema(
  {
    // 🔐 Login
    mobile: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "admin" },
    ownername: { type: String, default: "Nikhil Purbia" },

    // 🏢 Company Info (Used in Invoice Creator)
    companyname: { type: String, default: "" },
    address1: { type: String, default: "" },
    address2: { type: String, default: "" },
    acc: { type: String, default: "" },       // Phone or account
    iban: { type: String, default: "" },
    bic: { type: String, default: "" },

    gstNumber: { type: String, default: "" },
    email: { type: String, default: "" },

    defaultTaxRate: { type: Number, default: 18 },

    footerText: { type: String, default: "Thank you for your business!" },
    footerText2: { type: String, default: "" },

    logoUrl: { type: String, default: "" }
  },
  { timestamps: true }
)
export default mongoose.model("Admin", adminSchema)
