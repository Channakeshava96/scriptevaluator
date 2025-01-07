const express = require("express");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(cors());

// Serve static files from the current directory
app.use(express.static(__dirname));

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads"); // Upload directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
  },
});

// Initialize Multer
const upload = multer({ storage });

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Route for handling file uploads
app.post(
  "/upload-both",
  upload.fields([
    { name: "answerScript", maxCount: 1 },
    { name: "rubrics", maxCount: 1 },
  ]),
  (req, res) => {
    // Ensure both files are uploaded
    if (!req.files || !req.files.answerScript || !req.files.rubrics) {
      return res.status(400).json({ message: "Both files are required." });
    }

    // Log file details
    console.log("Answer Script File:", req.files.answerScript[0].path);
    console.log("Rubrics File:", req.files.rubrics[0].path);

    // Send response to client
    res.status(200).json({
      message: "Files uploaded successfully.",
      files: {
        answerScript: req.files.answerScript[0].filename,
        rubrics: req.files.rubrics[0].filename,
      },
    });
  }
);

// Create uploads directory if it doesn't exist
const fs = require("fs");
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
