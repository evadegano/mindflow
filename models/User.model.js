const { Schema, model } = require("mongoose");

// declare user schema
const userSchema = new Schema(
  {
    firstName: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, "Plese enter your first name."]
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, "Please enter your email address."],
      unique: [true, "This email address is already linked to an account."],
      match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Please use a valid email address."]
    },
    password: {
      type: String,
      required: [true, "Please enter a password."],
      match: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/, "Password must have at least 8 characters and include at least one lowercase and one uppercase letter, one number and one special character."]
    },
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
