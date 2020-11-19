import Link from "./link_collection/link"
import Spider from "./scraper/spider"
import * as cheerio from "cheerio"
import BBCPurifier from "./purifier/purifiers/bbc_purifier"
const link = new Link("https://www.bbc.com", "/sport/rugby-union/55001034")
const sp = Spider.spawn(link)
sp._scrapeHTML().then((_) => {
  const bbc = new BBCPurifier(sp._html, link)
  console.log(bbc.purify())
})
