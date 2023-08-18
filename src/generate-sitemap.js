import fs from "fs";

console.log("Generating sitemap...");
console.log("Args", process.argv);

const site = process.argv[2];

const demoUrl = "http://host.docker.internal:3001";
const accountUrl = "http://host.docker.internal:3000";

// const demoRoutes = [
//   {
//     path: "/",
//   },
//   {
//     path: "/home",
//   },
//   {
//     path: "/user-home",
//   },
//   {
//     path: "/blockchain-tx",
//   },
//   {
//     path: "/messages",
//   },
//   {
//     path: "/w3c-vcs",
//   },
//   {
//     path: "/callback",
//   },
// ];

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
// `${demoRoutes
//   .map(
//     (route) => `
//   <url>
//     <loc>${demoUrl}${route.path}</loc>
//   </url>`
//   )
// .join("\n")}
const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
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

fs.writeFileSync("dist/sitemap.xml", sitemapXml);

console.log("Sitemap generated successfully.");
