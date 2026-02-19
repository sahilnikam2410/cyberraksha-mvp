import mongoose from "mongoose";

const caseSchema = new mongoose.Schema(
  {
    ticketId: { type: String, unique: true, required: true },

    fullName: { type: String, required: true },
    phone: { type: String, default: "" },

    // ✅ Optional but useful
    email: { type: String, default: "" },

    category: { type: String, default: "WHATSAPP" },

    message: { type: String, required: true },
    link: { type: String, default: "" },
    upiId: { type: String, default: "" },

    suspectNumber: { type: String, default: "" },

    screenshotUrl: { type: String, default: "" },

    status: {
      type: String,
      enum: ["NEW", "SAFE", "SUSPICIOUS", "SCAM", "CLOSED"],
      default: "NEW"
    },

    severity: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH"],
      default: "MEDIUM"
    },

    analystReply: { type: String, default: "" },
    internalNotes: { type: String, default: "" },

    // ✅ USER LINK (Portal)
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }
  },
  { timestamps: true }
);

export default mongoose.model("Case", caseSchema);
