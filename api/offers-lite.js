export default async function handler(req, res) {
  try {
    const response = await fetch("https://www.boulliestravel.com/_functions/getOffersLite");
    const data = await response.json();
    const offers = data.offers || [];

    let rss = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
      <title>Boullies Travel Holiday Offers</title>
      <link>https://www.boulliestravel.com/holiday-offers</link>
      <description>Lite feed of current holiday offers from Boullies Travel</description>
      <atom:link href="https://boullies-rss.vercel.app/api/offers-lite" rel="self" type="application/rss+xml" />`;

    // Add a teaser/pinned item
    rss += `
      <item>
        <title><![CDATA[✨ Discover Our Latest Travel Offers ✨]]></title>
        <link>https://www.boulliestravel.com/holiday-offers</link>
        <guid isPermaLink="false">intro-message</guid>
        <description><![CDATA[
          Looking for your next adventure? 🌍✈️<br><br>
          Explore our handpicked holiday deals below and click any offer to learn more.<br><br>
          👉 <a href="https://www.boulliestravel.com/holiday-offers">View all current offers</a>
        ]]></description>
      </item>`;

    // Now add the actual offers
    offers.forEach((o, index) => {
      rss += `
        <item>
          <title><![CDATA[${o.title}]]></title>
          <link>${o.link}</link>
          <guid isPermaLink="false">${o.id || `offer-${index}`}</guid>
          <description><![CDATA[${o.subtitle || ""}<br><img src="${o.image}" />]]></description>
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
