export default async function handler(req, res) {
  try {
    const response = await fetch("https://www.boulliestravel.com/_functions/getOffersLite");
    const data = await response.json();
    const offers = data.offers || [];

    const now = new Date();

    let rss = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
      <title>Boullies Travel Holiday Offers</title>
      <link>https://www.boulliestravel.com/holiday-offers</link>
      <description>Lite feed of current holiday offers from Boullies Travel (drip-feed version)</description>
      <atom:link href="https://boullies-rss.vercel.app/api/offers-lite" rel="self" type="application/rss+xml" />
      <lastBuildDate>${now.toUTCString()}</lastBuildDate>`;

    // One <item> per offer (drip-feed style)
    offers.forEach((o, index) => {
      const offerLink = o["link-current-offers-title"]
        ? `https://www.boulliestravel.com${o["link-current-offers-title"]}`
        : "https://www.boulliestravel.com/holiday-offers";

      rss += `
        <item>
          <title><![CDATA[${o.title}]]></title>
          <link>${offerLink}</link>
          <guid isPermaLink="true">${offerLink}</guid>
          <pubDate>${new Date(o._publishDate || o._createdDate || now).toUTCString()}</pubDate>
          <description><![CDATA[
            🌍 Your daily Boullies Travel update ✨<br><br>
            <strong>${o.title}</strong><br>
            ${o.heroImage ? `<img src="${o.heroImage}" alt="${o.title}" /><br><br>` : ""}
            ${o.subtitle ? o.subtitle.substring(0, 180) + "..." : ""}<br><br>
            👉 <a href="${offerLink}">View this offer</a><br><br>
            ❤️ Like, 👍 Follow & 🔁 Share to stay up to date with our latest travel offers!<br>
            ❓ Would this be your dream trip? Vote in the comments 👇
          ]]></description>
        </item>`;
    });

    rss += `
    </channel>
    </rss>`;

    res.setHeader("Content-Type", "application/rss+xml; charset=utf-8");
    res.status(200).send(rss);

  } catch (err) {
    res.status(500).send("Error generating RSS: " + err.message);
  }
}
