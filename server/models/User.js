const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },

    // onboarding details
    domain: {
      type: String, // "Web Dev", "DSA", "AI", etc.
      required: false,
    },

    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },

    goals: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true } // automatically adds createdAt & updatedAt
);

module.exports = mongoose.model("User", UserSchema);
