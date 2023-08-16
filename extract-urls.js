import fs from "fs";
import path from "path";
import xml2js from "xml2js";

const sitemapFilePath = "path.join(__dirname, 'sitemap.xml')";

const parser = new xml2js.Parser();

fs.readFile(sitemapFilePath, (err, data) => {
  if (err) {
    console.error("Error reading XML file:", err);
    process.exit(1);
  }

  parser.parseString(data, (parseErr, result) => {
    if (parseErr) {
      console.error("Error parsing XML:", parseErr);
      process.exit(1);
    }

    const urls = result.urlset.url.map((urlObj) => urlObj.loc[0]);

    console.log(urls.join("\n"));
  });
});
