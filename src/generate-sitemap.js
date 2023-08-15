console.log("Generating sitemap...");
import fs from "fs";

console.log("routes");
let demoUrl;
let accountUrl;
const environment = process.argv[2];

if (environment === "demo") {
  demoUrl = "https://demo.demo.tonomy.foundation";
  accountUrl = "https://accounts.demo.tonomy.foundation";
} else if (environment === "staging") {
  demoUrl = "https://demo.staging.tonomy.foundation";
  accountUrl = "https://accounts.staging.tonomy.foundation";
} else {
  demoUrl = "http://demo.localhost:5174";
  accountUrl = "http://accounts.localhost:5174";
}

const demoRoutes = [
  {
    path: "/",
  },
  {
    path: "/home",
  },
  {
    path: "/user-home",
  },
  {
    path: "/blockchain-tx",
  },
  {
    path: "/messages",
  },
  {
    path: "/w3c-vcs",
  },
  {
    path: "/callback",
  },
];

const accountsRoutes = [
  {
    path: "/",
  },
  {
    path: "/download",
  },
  {
    path: "/login",
  },
  {
    path: "/callback",
  },
];

const sitemapXml = `
  <?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${demoRoutes
      .map(
        (route) => `
      <url>
        <loc>${demoUrl}${route.path}</loc>
      </url>`
      )
      .join("\n")}
      ${accountsRoutes
        .map(
          (route) => `
        <url>
          <loc>${accountUrl}${route.path}</loc>
        </url>`
        )
        .join("\n")}
  </urlset>
`;

fs.writeFileSync("public/sitemap.xml", sitemapXml);
console.log("Sitemap generated successfully.");
