import fs from "fs";

console.log("Generating sitemap...");
console.log("Args", process.argv);

const site = process.argv[2];

const demoUrl = "http://host.docker.internal:3001";
const accountUrl = "http://host.docker.internal:3000";

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

if (["demo", "accounts"].indexOf(site) === -1) {
  throw new Error("Invalid site name");
}

const urlToUse = site === "demo" ? demoUrl : accountUrl;
const routesToUse = site === "demo" ? demoRoutes : accountsRoutes;

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${routesToUse
        .map(
          (route) => `
        <url>
          <loc>${urlToUse}${route.path}</loc>
        </url>`
        )
        .join("\n")}
  </urlset>
`;

fs.writeFileSync("dist/sitemap.xml", sitemapXml);

console.log("Sitemap generated successfully.");
