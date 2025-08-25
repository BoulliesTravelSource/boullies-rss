export default async function handler(req, res) {
  try {
    // Fetch your Lite feed from Wix
    const response = await fetch("https://www.boulliestravel.com/_functions/getOffersLite");
    const data = await response.json();
    const offers = data.offers || [];

    // RSS header
    let rss = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0">
    <channel>
      <title>Boullies Travel Holiday Offers</title>
      <link>https://www.boulliestravel.com/holiday-offers</link>
      <description>Lite feed of current holiday offers from Boullies Travel</description>`;

    // Add each offer as <item>
    offers.forEach(o => {
      rss += `
        <item>
          <title><![CDATA[${o.title}]]></title>
          <link>${o.link}</link>
          <description><![CDATA[${o.subtitle || ""}<br><img src="${o.image}" />]]></description>
        </item>`;
    });

    rss += `
    </channel>
    </rss>`;

    // Send RSS response
    res.setHeader("Content-Type", "application/rss+xml; charset=utf-8");
    res.status(200).send(rss);

  } catch (err) {
    res.status(500).send("Error generating RSS: " + err.message);
  }
}
