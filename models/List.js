const mongoose = require("mongoose");

const ListSchema = new mongoose.Schema(
  {
    needList: {
      type: String,
      required: [true, "Please provide listing"],
      maxlength: 500,
    },

    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("List", ListSchema);
