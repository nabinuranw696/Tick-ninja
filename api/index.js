module.exports = async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ ok: false, message: "Method not allowed." });
    }

    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
    const url = String(body.url || "").trim();

    if (!url) {
      return res.status(400).json({ ok: false, message: "Please paste a TikTok URL." });
    }

    if (!/^(https?:\/\/)?([a-z0-9-]+\.)?tiktok\.com\//i.test(url)) {
      return res.status(400).json({ ok: false, message: "Please enter a valid TikTok URL." });
    }

    const response = await fetch("https://www.tikwm.com/api/", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "User-Agent": "Tick-Ninja/1.0"
      },
      body: new URLSearchParams({ url, hd: "1" })
    });

    if (!response.ok) throw new Error(`Provider returned ${response.status}`);

    const result = await response.json();
    if (result.code !== 0 || !result.data) {
      return res.status(422).json({
        ok: false,
        message: result.msg || "The video could not be processed."
      });
    }

    const d = result.data;
    return res.status(200).json({
      ok: true,
      data: {
        id: d.id || "",
        title: d.title || "TikTok video",
        cover: d.cover || d.origin_cover || "",
        author: {
          id: d.author?.id || "",
          unique_id: d.author?.unique_id || "",
          nickname: d.author?.nickname || ""
        },
        duration: d.duration || 0,
        play: d.play || "",
        hdplay: d.hdplay || d.play || "",
        watermark: d.wmplay || "",
        music: d.music || "",
        images: Array.isArray(d.images) ? d.images : []
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      message: "Service is temporarily unavailable. Please try again."
    });
  }
};
