const mongoose = require("mongoose");

const termsContentSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
      enum: ["user", "hr"],
    },
    content: {
      type: String,
      required: true,
    },
  },
  { collection: "terms" }
);

const TermsContent = mongoose.model("TermsContent", termsContentSchema);

module.exports = TermsContent;
