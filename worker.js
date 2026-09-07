function xmlText(value = "") {
  return value
    .replace(/<!\[CDATA\[/g, "")
    .replace(/\]\]>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function responseJson(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "public, max-age=300, s-maxage=300",
      "access-control-allow-origin": "*"
    }
  });
}

async function youtubeLatest(request) {
  const url = new URL(request.url);
  const limit = Math.min(Math.max(Number(url.searchParams.get("limit") || 6), 1), 12);

  try {
    const channelPage = "https://www.youtube.com/@TFTZMo3az";
    const channelResponse = await fetch(channelPage, {
      headers: {
        "user-agent": "Mozilla/5.0 (compatible; TFTZLiveHub/1.0)"
      },
      cf: { cacheTtl: 300, cacheEverything: true }
    });

    if (!channelResponse.ok) {
      return responseJson({ items: [], error: "YouTube channel fetch failed" }, 502);
    }

    const html = await channelResponse.text();
    const match = html.match(/"channelId":"(UC[^\"]+)"/);
    if (!match) {
      return responseJson({ items: [], error: "YouTube channel ID not found" }, 502);
    }

    const channelId = match[1];
    const rssResponse = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${encodeURIComponent(channelId)}`,
      { cf: { cacheTtl: 300, cacheEverything: true } }
    );

    if (!rssResponse.ok) {
      return responseJson({ items: [], error: "YouTube RSS fetch failed" }, 502);
    }

    const rss = await rssResponse.text();
    const entries = [...rss.matchAll(/<entry>([\s\S]*?)<\/entry>/g)]
      .slice(0, limit)
      .map((m) => {
        const x = m[1];
        const get = (re) => x.match(re)?.[1] || "";
        const id = get(/<yt:videoId>([^<]+)<\/yt:videoId>/);
        const title = xmlText(get(/<title>([\s\S]*?)<\/title>/));
        const date = get(/<published>([^<]+)<\/published>/);
        return {
          id,
          title,
          date: date
            ? new Date(date).toLocaleDateString("ar-EG", {
                year: "numeric",
                month: "short",
                day: "numeric"
              })
            : "",
          thumb: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
          url: `https://www.youtube.com/watch?v=${id}`
        };
      })
      .filter((item) => item.id);

    return responseJson({ items });
  } catch (error) {
    return responseJson({ items: [], error: "YouTube API error" }, 500);
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/youtube") {
      return youtubeLatest(request);
    }

    // Everything else is served from the site's static assets.
    return env.ASSETS.fetch(request);
  }
};
