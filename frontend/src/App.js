import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [longUrl, setLongUrl] = useState("");
  const [customSlug, setCustomSlug] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [quote, setQuote] = useState("Fetching a quote...");
  const [error, setError] = useState("");
  const [showExpiryOptions, setShowExpiryOptions] = useState(false);

  // Fetch Quote of the Day
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/quote")
      .then((response) => {
        setQuote(response.data.quote);
      })
      .catch((error) => {
        console.error("Error fetching quote:", error);
        setQuote("Failed to fetch a quote. Please try again later.");
      });
  }, []);

  // Handle basic URL shortening
  const handleShorten = async () => {
    if (!longUrl.trim()) {
      alert("Please enter a URL!");
      return;
    }

    let urlData = { url: longUrl };
    if (customSlug.trim()) {
      urlData.slug = customSlug;
    }

    try {
      const response = await fetch("http://localhost:5000/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(urlData),
      });
      const data = await response.json();
      if (data.shortUrl) {
        setShortUrl(data.shortUrl);
        setError("");
      } else {
        alert("Error shortening URL");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Server error! Please try again later.");
    }
  };

  // Handle timed URL shortening
  const handleExpiryTimeSelect = async (time) => {
    if (!longUrl.trim()) {
      alert("Please enter a URL!");
      return;
    }

    let urlData = { url: longUrl, expirationTime: time };
    if (customSlug.trim()) {
      urlData.slug = customSlug;
    }

    try {
      const response = await fetch("http://localhost:5000/api/shorten-timed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(urlData),
      });
      const data = await response.json();
      if (data.shortUrl) {
        setShortUrl(data.shortUrl);
        setError("");
        setShowExpiryOptions(false); // Hide timer options after success
      } else {
        alert("Error shortening URL");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Server error! Please try again later.");
    }
  };

  // Show expiry time options
  const handleShowExpiryOptions = () => {
    setShowExpiryOptions(true);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to liNkR!</h1>
        <p>Where URLs get a personality 🚀</p>

        <input
          type="text"
          placeholder="Enter your long URL here..."
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
        />

        <input
          type="text"
          placeholder="Enter custom slug (optional)..."
          value={customSlug}
          onChange={(e) => setCustomSlug(e.target.value)}
        />

        <button onClick={handleShorten}>Shorten URL</button>

        <button onClick={handleShowExpiryOptions}>Shorten URL to Auto-Expire</button>

        {showExpiryOptions && (
          <div className="expiry-options">
            <button onClick={() => handleExpiryTimeSelect(24 * 60 * 60 * 1000)}>
              24 hours
            </button>
            <button onClick={() => handleExpiryTimeSelect(48 * 60 * 60 * 1000)}>
              48 hours
            </button>
            <button onClick={() => handleExpiryTimeSelect(7 * 24 * 60 * 60 * 1000)}>
              1 week
            </button>
            <button onClick={() => handleExpiryTimeSelect(14 * 24 * 60 * 60 * 1000)}>
              2 weeks
            </button>
            <button onClick={() => handleExpiryTimeSelect(30 * 24 * 60 * 60 * 1000)}>
              1 month
            </button>
          </div>
        )}

        {shortUrl && (
          <div className="result">
            <p>Your shiny new URL 👇</p>
            <a href={shortUrl} target="_blank" rel="noopener noreferrer">
              {shortUrl}
            </a>
          </div>
        )}

        {error && <div className="error">{error}</div>}

        <p className="quote-of-the-day">{quote}</p>
      </header>

      <footer className="App-footer">
        <p style={{ fontFamily: "monospace" }}>
          Made with ❤️ by Nithin Ravi (@thebinarybot)
        </p>
      </footer>
    </div>
  );
}

export default App;
