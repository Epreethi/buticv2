const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const { korm, initKorm } = require("./config/korm");
const multer = require("multer");
const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const upload = multer({
  storage: multer.memoryStorage(),
  // No limits set, allowing unlimited file size
});

// API Routes
app.get("/health", (req, res) => {
  res.send("OK");
});

app.post("/api/file/upload", upload.single("file"), async (req, res) => {
  try {
    // The uploaded file is available as req.file (buffer, originalname, mimetype, etc.)
    if (!req.file) {
      return res
        .status(400)
        .json({
          error: 'No file uploaded. Please use a "file" field in form-data.',
        });
    }
    // Pass the file object to the helper for upload
    const result = await helperUtility.file.upload2Spaces({
      fileBuffer: req.file.buffer,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
    });
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message, stack: error.stack });
  }
});

app.post("/api/:model/crud", async (req, res) => {
  try {
    const { model } = req.params;
    const headers = req.headers;
    const cookies = headers.cookie;
    const options = {
      cookies,
      headers
    };
    const { cookie, ...result } = await korm.processRequest(req.body, model,options) || {};
    if(cookie) {
      // if cookie.value is null, delete the cookie
      if(cookie.value === null) {
        res.clearCookie(cookie.name);
      } else {
        res.cookie(cookie.name, cookie.value, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: cookie.expires,
        });
      }
    }
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Serve static files from the Vite build directory
app.use(
  express.static(path.join(__dirname, "client/dist"), {
    index: false, // Do not serve index.html automatically
  })
);

// Catch all handler: send back React's index.html file for any non-API routes
app.get("*", (req, res) => {
  const fs = require("fs");
  const indexPath = path.join(__dirname, "client/dist", "index.html");
  fs.readFile(indexPath, "utf8", (err, html) => {
    if (err) {
      console.error("Error reading index.html:", err);
      return res.status(500).send("Server error");
    }
    // Server-rendered data
    const serverData = {
      APP_TITLE: "Butic V2",
      SERVER_JSON: JSON.stringify({
        message: "This is server-rendered data!",
        timestamp: new Date().toISOString(),
      }),
    };
    let renderedHtml = html;
    try {
      renderedHtml = new Function("serverData", "return `" + html + "`;")(
        serverData
      );
    } catch (e) {
      console.error("Error rendering template:", e);
    }
    // console.log(renderedHtml);
    res.send(renderedHtml);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Initialize KORM and start server
async function startServer() {
  try {
    // Initialize KORM with schema
    // await initializeKORMWithSchema();

    // Start the server
    const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`API endpoints available at http://localhost:${PORT}/api`);
      console.log(`KORM database operations ready!`);
    });

    // Handle server errors gracefully
    server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.error(
          `Port ${PORT} is already in use. Please kill the process using this port or use a different port.`
        );
        console.error(
          "To kill the process, run: lsof -ti:5001 | xargs kill -9"
        );
        process.exit(1);
      } else {
        console.error("Server error:", err);
        process.exit(1);
      }
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

initKorm()
  .then(() => {
    startServer();
  })
  .catch((error) => {
    console.error("Failed to initialize KORM:", error);
    process.exit(1);
  });
