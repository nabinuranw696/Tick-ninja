const form = document.querySelector("#lookupForm");
const input = document.querySelector("#urlInput");
const statusBox = document.querySelector("#status");
const result = document.querySelector("#result");
const title = document.querySelector("#title");
const author = document.querySelector("#author");
const thumbnail = document.querySelector("#thumbnail");
const thumbPlaceholder = document.querySelector("#thumbPlaceholder");
const sourceUrl = document.querySelector("#sourceUrl");
const embed = document.querySelector("#embed");

function status(message, error = false) {
  statusBox.textContent = message;
  statusBox.classList.remove("hidden");
  statusBox.style.borderColor = error ? "#6e2636" : "";
}

function clearResult() {
  result.classList.add("hidden");
  embed.innerHTML = "";
  thumbnail.classList.add("hidden");
  thumbPlaceholder.classList.remove("hidden");
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearResult();

  const url = input.value.trim();
  if (!url) return;

  status("Loading public TikTok metadata…");

  try {
    const response = await fetch(`/api/oembed?url=${encodeURIComponent(url)}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Unable to load this URL.");
    }

    title.textContent = data.title || "TikTok post";
    author.textContent = data.authorName ? `@${data.authorName}` : "TikTok creator";
    author.href = data.authorUrl || "#";
    sourceUrl.textContent = data.url;

    if (data.thumbnailUrl) {
      thumbnail.src = data.thumbnailUrl;
      thumbnail.classList.remove("hidden");
      thumbPlaceholder.classList.add("hidden");
    }

    // TikTok supplies the embed HTML for the public URL.
    embed.innerHTML = data.html || "<p>No embed was supplied for this item.</p>";

    // Load TikTok's embed script so the blockquote becomes interactive.
    if (!document.querySelector('script[src="https://www.tiktok.com/embed.js"]')) {
      const script = document.createElement("script");
      script.src = "https://www.tiktok.com/embed.js";
      script.async = true;
      document.body.appendChild(script);
    } else if (window.tiktok?.embed?.lib) {
      window.tiktok.embed.lib();
    }

    result.classList.remove("hidden");
    status("Loaded public metadata.");
  } catch (error) {
    status(error.message, true);
  }
});

document.querySelector("[data-example]").addEventListener("click", () => {
  input.focus();
  input.select();
});