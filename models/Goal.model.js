// package used to connect to the database
const { Schema, model } = require("mongoose");

// goal schema
const goalSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    endDate: Date,
    title: { 
      type: String,
      required: true
    },
    category: String,
    color: {
      type: String,
      default: "#636EE6"
    },
    isDone: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
)

// create goal model
const Goal = model("Goal", goalSchema);

module.exports = Goal;