import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// ==========================================
// User Model - Role Based Access Control
// Roles: buyer | seller | admin
// ==========================================

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: [3, "Full name must be at least 3 characters"],
      maxlength: [60, "Full name cannot exceed 60 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },

    contact: {
      type: String,
      required: [true, "Contact number is required"],
      unique: true,
      match: [/^\d{10}$/, "Contact must be a valid 10-digit number"],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },

    role: {
      type: String,
      enum: {
        values: ["buyer", "seller", "admin"],
        message: "Role must be buyer, seller, or admin",
      },
      default: "buyer",
    },

    // Profile & preferences
    avatar: {
      type: String,
      default: null,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },


    // Timestamps for activity tracking
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

// ==========================================
// Pre-save Hook: Hash password before saving
// ==========================================
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const hash = await bcrypt.hash(this.password, 12);
  this.password = hash;
});

// ==========================================
// Instance Method: Compare password
// ==========================================
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// ==========================================
// Instance Method: Get safe user object (no password)
// ==========================================
userSchema.methods.toSafeObject = function () {
  return {
    id: this._id,
    fullname: this.fullname,
    email: this.email,
    contact: this.contact,
    role: this.role,
    avatar: this.avatar,
    isVerified: this.isVerified,
    createdAt: this.createdAt,
  };
};

const userModel = mongoose.model("user", userSchema);

export default userModel;
