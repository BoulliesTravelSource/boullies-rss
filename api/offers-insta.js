export default async function handler(req, res) {
  try {
    const response = await fetch("https://www.boulliestravel.com/_functions/getOffersLite");
    const data = await response.json();
    const offers = data.offers || [];

    const now = new Date();

    // Hashtag rotation function
    function getHashtags(title, country, resort) {
      const lower = (title || "").toLowerCase();

      if (lower.includes("lapland") || lower.includes("santa")) {
        return "#LaplandMagic #SantaExperience #FamilyChristmas #BoulliesTravel";
      }
      if (lower.includes("cruise")) {
        return "#CruiseLife #LuxuryCruise #BoulliesTravel";
      }
      if (lower.includes("disney") || lower.includes("orlando")) {
        return "#DisneyMagic #FamilyHoliday #BoulliesTravel #OrlandoDreams";
      }
      if (lower.includes("safari") || lower.includes("africa")) {
        return "#AfricanSafari #AdventureTravel #BoulliesTravel #WildlifeHoliday";
      }
      if (lower.includes("beach") || lower.includes("maldives") || lower.includes("mauritius")) {
        return "#BeachVibes #LuxuryResort #TropicalEscape #BoulliesTravel";
      }
      if (lower.includes("honeymoon")) {
        return "#LuxuryHoneymoon #RomanticEscape #BoulliesTravel #DreamHoliday";
      }
      if (lower.includes("wedding")) {
        return "#OverseasWedding #DestinationWedding #LuxuryTravel #BoulliesTravel";
      }
      if (lower.includes("golf")) {
        return "#GolfHoliday #LuxuryGolf #BoulliesTravel";
      }
      if (lower.includes("rugby")) {
        return "#RugbyTravel #SportsTour #BoulliesTravel #LuxurySports";
      }
      if (lower.includes("sport") || lower.includes("sports")) {
        return "#SportsHoliday #AdventureTravel #BoulliesTravel #TeamSpirit";
      }

      // fallback/general set with geo-tagging
      let geoTag = country ? `#${country.replace(/\s+/g, '')}` : "";
      if (!geoTag && resort) geoTag = `#${resort.replace(/\s+/g, '')}`;
      
      return `#BoulliesTravel #LuxuryTravel #FamilyHolidays #DreamHoliday ${geoTag}`;
    }

    // RSS header
    let rss = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
      <title>Boullies Travel Holiday Offers (Instagram)</title>
      <link>https://www.boulliestravel.com/holiday-offers</link>
      <description>Instagram-optimised feed of current holiday offers from Boullies Travel</description>
      <atom:link href="https://boullies-rss.vercel.app/api/offers-insta" rel="self" type="application/rss+xml" />
      <lastBuildDate>${now.toUTCString()}</lastBuildDate>`;

    // Each offer → one <item>
    offers.forEach(o => {
      const pubDate = new Date(o._publishDate || o._createdDate || now).toUTCString();
      const hashtags = getHashtags(o.title, o.country, o.resort);

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
            ${hashtags}
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
