// models/Contact.js
const mongoose = require("mongoose");
const validator = require("validator");

const contactSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: [3, "Name must be at least 3 characters long"],
      maxlength: [50, "Name cannot exceed 50 characters"],
      validate: {
        validator: function (v) {
          return /^[A-Za-z\s]+$/.test(v);
        },
        message: "Name can only contain alphabets and spaces",
      },
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },

    mobileNumber: {
      type: String,
      required: [true, "Mobile number is required"],
      validate: {
        validator: function (v) {
          return validator.isMobilePhone(v.toString(), "any");
        },
        message: "Please enter a valid mobile number",
      },
    },

    userType: {
      type: String,
    },

    productType: {
      type: [String],
      required: [true, "Product selection is required"],
    },

    companyName: {
      type: String,
      trim: true,
    },

    country: {
      type: String,
      trim: true,
      minlength: [2, "Country must be at least 2 characters"],
      maxlength: [100, "Country cannot exceed 100 characters"],
    },

    city: {
      type: String,
      trim: true,
      minlength: [2, "City must be at least 2 characters"],
      maxlength: [100, "City cannot exceed 100 characters"],
    },

    state: {
      type: String,
      trim: true,
      minlength: [2, "State must be at least 2 characters"],
      maxlength: [100, "State cannot exceed 100 characters"],
    },

    representative: {
      type: String,
      trim: true,
      minlength: [3, "Name must be at least 3 characters long"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },

    leadType: {
      type: String,
    },

    place: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contact", contactSchema);
