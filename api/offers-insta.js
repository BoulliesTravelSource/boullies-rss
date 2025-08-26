export default async function handler(req, res) {
  try {
    const response = await fetch("https://www.boulliestravel.com/_functions/getOffersLite");
    const data = await response.json();
    const offers = data.offers || [];

    const now = new Date();

    let rss = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
      <title>Boullies Travel Holiday Offers (Instagram)</title>
      <link>https://www.boulliestravel.com/holiday-offers</link>
      <description>Instagram-optimised feed of current holiday offers from Boullies Travel</description>
      <atom:link href="https://boullies-rss.vercel.app/api/offers-insta" rel="self" type="application/rss+xml" />
      <lastBuildDate>${now.toUTCString()}</lastBuildDate>`;

    // One <item> per offer
    offers.forEach(o => {
      const pubDate = new Date(o._publishDate || o._createdDate || now).toUTCString();

      rss += `
        <item>
          <title><![CDATA[${o.title}]]></title>
          <link>https://www.boulliestravel.com/holiday-offers</link>
          <guid isPermaLink="false">insta-${o._id || pubDate}</guid>
          <pubDate>${pubDate}</pubDate>
          <description><![CDATA[
            🌍 Your daily Boullies Travel update ✨<br><br>
            <strong>${o.title}</strong><br><br>
            ${o.subtitle ? o.subtitle.substring(0, 100) + (o.subtitle.length > 100 ? "..." : "") : ""}<br><br>
            ❤️ Like, 👍 Follow & 🔁 Share to stay up to date with our latest travel offers!<br>
            🔗 See link in bio for all current offers!<br><br>
            #TravelWithBoullies #LuxuryTravel #FamilyHolidays #DreamHoliday
          ]]></description>
          ${o.heroImage ? `<enclosure url="${o.heroImage}" type="image/jpeg" />` : ""}
        </item>`;
    });

    rss += `
    </channel>
    </rss>`;

    res.setHeader("Content-Type", "application/rss+xml; charset=utf-8");
    res.status(200).send(rss);

  } catch (err) {
    res.status(500).send("Error generating Instagram RSS: " + err.message);
  }
}