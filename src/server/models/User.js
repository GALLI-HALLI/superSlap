const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    type: {
      type: String,
      enum: ["google", "superslap"],
      default: "superslap",
      required: true,
    },
  },
  {
    timestamps: true, //언제 생성, 업데이트 됐는지
  }
);

module.exports = mongoose.model("GameUser", userSchema);
