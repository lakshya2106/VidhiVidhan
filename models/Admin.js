// import mongoose from 'mongoose';

// const adminSchema = new mongoose.Schema({
//   mobile: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
// })

// export default mongoose.models.Admin || mongoose.model('Admin', adminSchema)


import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    // 🔐 Auth
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "admin",
    },

    // 🏢 Business Profile (Editable)
    adminName: {
      type: String,
      default: "Nikhil Purbia",
    },
    businessName: {
      type: String,
      default: "Vidhi Vidhan",
    },
    email: {
      type: String,
      default: "vidhividhan24@gmail.com",
    },
    businessMobile: {
      type: String,
      default: "9694804435",
    },
    address: {
      type: String,
      default: "97, Gulabeshwar Marg Inside Hathipol, Udaipur, Rajasthan 313001",
    },
    gstNumber: {
      type: String,
      default: "",
    },

    // 🖼 Future Ready
    logoUrl: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt automatically
  }
);

export default mongoose.models.Admin ||
  mongoose.model("Admin", adminSchema);
