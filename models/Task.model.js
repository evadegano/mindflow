const { Schema, model } = require("mongoose");

const taskSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    goal_id: {
      type: Schema.Types.ObjectId,
      ref: "Goal"
    },
    title: { 
      type: String,
      required: true
    },
    isDone: {
      type: Boolean,
      default: false
    },
    endDate: {
      type: Date,
      default: Date.now
    },
  },
  {
    timestamps: true
  }
)

const Task = model("Task", taskSchema);

module.exports = Task;