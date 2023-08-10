import fs from "fs";

function generateSitemap(urls, environment) {
  const sitemapContent = `
  <?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls
      .map(
        (page) => `
      <url>
        <loc>${page.url}</loc>
      </url>`
      )
      .join("\n")}
  </urlset>`;

  fs.writeFileSync(
    `./${environment}-sitemap/sitemap.xml`,
    sitemapContent,
    "utf-8"
  );
}

// console.log("location", window.location); // window.location is not available in Node.js
const domain = "http://192.168.31.115";

const demoPages = [
  { url: `${domain}:3001/home` },
  { url: `${domain}:3001/user-home` },
];

const accountsPages = [
  { url: `${domain}:3000/` },
  { url: `${domain}:3000/login` },
];

const environment = process.argv[2];

if (environment === "demo") {
  generateSitemap(demoPages, "demo");
} else if (environment === "accounts") {
  generateSitemap(accountsPages, "accounts");
} else {
  console.error("Invalid environment specified.");
}
