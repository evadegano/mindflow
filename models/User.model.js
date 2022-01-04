// package used to connect to the database
const { Schema, model } = require("mongoose");

// user schema
const userSchema = new Schema(
  {
    firstName: {
      type: String,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      sparse: [true, "This email address is already linked to an account."],
      match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Please provide a valid email address."]
    },
    password: {
      type: String,
      match: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/, "Password must have at least 8 characters and include at least one lowercase and one uppercase letter, one number and one special character."]
    },
    googleID: String,
  },
  {
    timestamps: true,
  }
);

// create user model
const User = model("User", userSchema);

module.exports = User;
