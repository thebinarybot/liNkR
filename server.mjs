import express from "express";
import bodyParser from "body-parser";
import { nanoid } from "nanoid";
import cors from "cors";
import axios from "axios";

const app = express();
const port = 5000;

const urlDatabase = {}; // Store URL mappings
const slugDatabase = new Set(); // Store used slugs

app.use(bodyParser.json());
app.use(cors());

// Shorten URL with optional custom slug
app.post("/api/shorten", (req, res) => {
  const { url, slug, expirationTime } = req.body;
  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  let finalSlug = slug ? slug.trim() : null;

  // Check if custom slug is provided and valid
  if (finalSlug) {
    if (slugDatabase.has(finalSlug)) {
      return res.status(400).json({ error: "Slug is already taken" });
    }
    slugDatabase.add(finalSlug);
  } else {
    // Auto-generate a slug if no custom slug is provided
    finalSlug = nanoid(6);
    slugDatabase.add(finalSlug);
  }

  const shortUrl = `http://localhost:${port}/${finalSlug}`;

  const expirationTimestamp = expirationTime ? Date.now() + expirationTime : null;

  urlDatabase[finalSlug] = {
    url,
    expirationTime: expirationTimestamp,
  };
  
  res.json({ shortUrl });
});

// Fetch Quote of the Day
app.get("/api/quote", async (req, res) => {
  try {
    const response = await axios.get("https://zenquotes.io/api/random");
    const quoteData = response.data[0];
    const quote = `${quoteData.q} - ${quoteData.a}`;
    res.json({ quote });
  } catch (error) {
    console.error("Error fetching quote:", error);
    res.status(500).json({ error: "Failed to fetch quote. Please try again later." });
  }
});

// Redirect to original URL based on slug
app.get("/:slug", (req, res) => {
  const slug = req.params.slug;
  const urlData = urlDatabase[slug];

  if (!urlData) {
    return res.status(404).send("URL not found");
  }

  const currentTime = Date.now();
  if (urlData.expirationTime && currentTime > urlData.expirationTime) {
    delete urlDatabase[slug]; // Remove expired URL
    return res.status(410).send("This link has expired");
  }

  res.redirect(urlData.url); // Redirect to the original URL
});

// Start the server and listen on port 5000
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
