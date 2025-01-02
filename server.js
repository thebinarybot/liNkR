const express = require("express");
const bodyParser = require("body-parser");
const { nanoid } = require("nanoid");
const cors = require("cors"); 

const app = express();
const port = 5000;

const urlDatabase = {};

app.use(bodyParser.json());
app.use(cors()); 

app.post("/api/shorten", (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }
  const slug = nanoid(6);
  const shortUrl = `http://localhost:${port}/${slug}`;
  urlDatabase[slug] = url;
  res.json({ shortUrl });
});

app.get("/:slug", (req, res) => {
  const slug = req.params.slug;
  const originalUrl = urlDatabase[slug];
  if (originalUrl) {
    res.redirect(originalUrl);
  } else {
    res.status(404).send("URL not found");
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
