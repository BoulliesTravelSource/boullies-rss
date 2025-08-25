export default async function handler(req, res) {
  try {
    // Fetch the full JSON feed from Wix
    const response = await fetch("https://www.boulliestravel.com/_functions/getOffersFull");
    const data = await response.json();
    const offers = data.offers || [];

    // RSS header
    let rss = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0">
    <channel>
      <title>Boullies Travel Full Holiday Offers</title>
      <link>https://www.boulliestravel.com/holiday-offers</link>
      <description>Complete feed of current holiday offers from Boullies Travel</description>`;

    // Add each offer as <item>
    offers.forEach(o => {
      rss += `
        <item>
          <title><![CDATA[${o.title || "Untitled Offer"}]]></title>
          <link>${o.link || "https://www.boulliestravel.com/holiday-offers"}</link>
          <description><![CDATA[
            ${o.subtitle ? "<strong>Subtitle:</strong> " + o.subtitle + "<br>" : ""}
            ${o.price ? "<strong>Price:</strong> " + o.price + "<br>" : ""}
            ${o.resort ? "<strong>Resort:</strong> " + o.resort + "<br>" : ""}
            ${o.country ? "<strong>Country:</strong> " + o.country + "<br>" : ""}
            ${o.board ? "<strong>Board:</strong> " + o.board + "<br>" : ""}
            ${o.nights ? "<strong>Nights:</strong> " + o.nights + "<br>" : ""}
            ${o.departureDate ? "<strong>Departure Date:</strong> " + o.departureDate + "<br>" : ""}
            ${o.validFrom ? "<strong>Valid From:</strong> " + o.validFrom + "<br>" : ""}
            ${o.validUntil ? "<strong>Valid Until:</strong> " + o.validUntil + "<br>" : ""}
            ${o.publishDate ? "<strong>Published:</strong> " + o.publishDate + "<br>" : ""}
            ${o.description ? "<br><strong>Description:</strong><br>" + o.description + "<br>" : ""}
            ${o.heroImage ? "<br><img src='" + o.heroImage + "' />" : ""}
            ${o.mediaGallery && o.mediaGallery.length ? "<br><strong>Gallery:</strong><br>" + o.mediaGallery.map(m => `<img src="${m.src}" alt="${m.alt || ""}" />`).join("<br>") : ""}
          ]]></description>
          <guid>${o.id || ""}</guid>
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
