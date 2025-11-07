const mongoose = require("mongoose");

const DepartmentInviteSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    createdBy: {
      type: String, // vì userId ở service khác
      required: true,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
    usedBy: [
      {
        type: String, // cũng là userId (string)
      },
    ],
    maxUses: {
      type: Number,
      default: 1,
    },
    status: {
      type: String,
      enum: ["active", "expired", "disabled"],
      default: "active",
    },
  },
  { timestamps: true }
);

// middleware check expired
DepartmentInviteSchema.pre("save", function (next) {
  if (this.expiresAt < Date.now()) {
    this.status = "expired";
  }
  next();
});

module.exports = mongoose.model("DepartmentInvite", DepartmentInviteSchema);
