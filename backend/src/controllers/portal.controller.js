import Case from "../models/Case.js";

/**
 * GET /api/portal/my-cases
 */
export async function getMyCases(req, res) {
  try {
    const userId = req.user._id;

    // ✅ FIX: createdBy ❌ -> userId ✅
    const cases = await Case.find({ userId: userId })
      .sort({ createdAt: -1 })
      .lean();

    return res.json(cases);
  } catch (err) {
    console.error("getMyCases error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

/**
 * POST /api/portal/report
 */
export async function createPortalCase(req, res) {
  try {
    const { category, message, suspectNumber, link } = req.body;

    if (!category || !message) {
      return res.status(400).json({ message: "Category and message required" });
    }

    let screenshotUrl = "";
    if (req.file) {
      screenshotUrl = `/uploads/${req.file.filename}`;
    }

    const newCase = await Case.create({
      ticketId: `CRK-${Math.random()
        .toString(36)
        .substring(2, 10)
        .toUpperCase()}`,

      fullName: req.user.name,
      phone: req.user.phone || "",
      email: req.user.email,

      category,
      message,
      suspectNumber: suspectNumber || "",
      link: link || "",

      screenshotUrl,

      status: "NEW",
      severity: "MEDIUM",
      analystReply: "",
      internalNotes: "",

      // ✅ FIX: createdBy ❌ -> userId ✅
      userId: req.user._id
    });

    return res.status(201).json(newCase);
  } catch (err) {
    console.error("createPortalCase error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}
