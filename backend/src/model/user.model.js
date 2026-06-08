const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { VALID_ACCESS_TYPES, VALID_PERMISSIONS } = require("../constants/access.js");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    accessType: {
      type: String,
      default: "custom",
      enum: VALID_ACCESS_TYPES,
    },
    permissions: {
      type: [String],
      default: [],
      enum: VALID_PERMISSIONS,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
