const form = document.getElementById("downloadForm");
const input = document.getElementById("urlInput");
const pasteBtn = document.getElementById("pasteBtn");
const submitBtn = document.getElementById("submitBtn");
const statusEl = document.getElementById("status");
const resultEl = document.getElementById("result");
const themeBtn = document.getElementById("themeBtn");

document.getElementById("year").textContent = new Date().getFullYear();

function setStatus(message, ok=false){
  statusEl.textContent = message || "";
  statusEl.className = "status" + (ok ? " ok" : "");
}

pasteBtn.addEventListener("click", async () => {
  try {
    input.value = await navigator.clipboard.readText();
    input.focus();
    setStatus("Link pasted. Tap Get video.", true);
  } catch {
    input.focus();
    setStatus("Clipboard access was blocked. Paste the link manually.");
  }
});

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("light");
  themeBtn.textContent = document.body.classList.contains("light") ? "☾" : "☀";
});

function button(label, url, primary=false){
  if (!url) return "";
  return `<a ${primary ? 'class="primary"' : ""} href="${url}" target="_blank" rel="noopener" download>${label}</a>`;
}

function renderResult(d){
  const author = d.author?.nickname || d.author?.unique_id || "TikTok creator";
  resultEl.innerHTML = `
    <div class="result-top">
      ${d.cover ? `<img class="thumb" src="${d.cover}" alt="Video cover" loading="lazy">` : ""}
      <div class="result-info">
        <div class="result-title">${escapeHtml(d.title || "TikTok video")}</div>
        <div class="author">@${escapeHtml(author.replace(/^@/, ""))}</div>
        <div class="actions">
          ${button("Download HD", d.hdplay, true)}
          ${button("Download video", d.play)}
          ${button("Audio MP3", d.music)}
          ${button("With watermark", d.watermark)}
        </div>
      </div>
    </div>
  `;
  resultEl.classList.remove("hidden");
}

function escapeHtml(value){
  return String(value).replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[c]));
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const url = input.value.trim();
  resultEl.classList.add("hidden");
  setStatus("");

  if (!url) {
    setStatus("Please paste a TikTok link.");
    return;
  }

  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="spinner"></span><span>Processing…</span>';

  try {
    const response = await fetch("/api/download", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({url})
    });
    const data = await response.json();

    if (!response.ok || !data.ok) {
      throw new Error(data.message || "Could not process this link.");
    }

    renderResult(data.data);
    setStatus("Video is ready. Choose a download option.", true);
    resultEl.scrollIntoView({behavior:"smooth", block:"center"});
  } catch (err) {
    setStatus(err.message || "Something went wrong. Please try again.");
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<span>Get video</span><span class="arrow">→</span>';
  }
});
