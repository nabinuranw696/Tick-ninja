import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "32kb" }));
app.use(express.static(path.join(__dirname, "public")));

function isTikTokUrl(value) {
  try {
    const u = new URL(value);
    return ["www.tiktok.com", "tiktok.com", "m.tiktok.com"].includes(u.hostname);
  } catch {
    return false;
  }
}

function normalizeTikTokUrl(value) {
  const u = new URL(value);
  u.hash = "";
  return u.toString();
}

/*
  Public oEmbed endpoint.
  This returns metadata/embed HTML for a public TikTok URL.
  It does not authenticate as a TikTok user or access private content.
*/
app.get("/api/oembed", async (req, res) => {
  const input = String(req.query.url || "").trim();

  if (!input || !isTikTokUrl(input)) {
    return res.status(400).json({
      error: "Enter a valid public TikTok URL."
    });
  }

  const url = normalizeTikTokUrl(input);
  const endpoint = `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`;

  try {
    const response = await fetch(endpoint, {
      headers: {
        "User-Agent": "Mozilla/5.0 TikNinjaStyleViewer/1.0"
      }
    });

    const text = await response.text();

    if (!response.ok) {
      return res.status(response.status).json({
        error: "TikTok did not return an embeddable public item.",
        details: text.slice(0, 300)
      });
    }

    const data = JSON.parse(text);

    return res.json({
      title: data.title || "",
      authorName: data.author_name || "",
      authorUrl: data.author_url || "",
      thumbnailUrl: data.thumbnail_url || "",
      html: data.html || "",
      url
    });
  } catch (error) {
    console.error(error);
    return res.status(502).json({
      error: "Could not reach TikTok's public embed service."
    });
  }
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "tikninja-style-viewer" });
});

app.get("*splat", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`TikNinja-style viewer running at http://localhost:${PORT}`);
});