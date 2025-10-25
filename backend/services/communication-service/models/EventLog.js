// models/EventLog.js
import mongoose from "mongoose";

const EventLogSchema = new mongoose.Schema(
  {
    eventType: {
      type: String,
      enum: ["interview_created", "interview_confirmed", "message_sent"],
      required: true,
    },
    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    actorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    metadata: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

export default mongoose.model("EventLog", EventLogSchema);
