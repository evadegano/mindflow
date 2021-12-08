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
    title: String,
    isDone: Boolean,
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