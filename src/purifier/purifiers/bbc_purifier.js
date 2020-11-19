import Purifier from "../purifier"
import * as cheerio from "cheerio"
export default class BBCPurifier extends Purifier {
  constructor(html, link) {
    super(html, link)
  }
  purify() {
    const $ = cheerio.load(this.html)
    const headline = $("article > header > h1").text()
    const subCategory = $(".story-info > span > a").text()
    const category = $(`meta[property="og:site_name"]`)
      .attr("content")
      .trim()
      .split(" ")[1]
    return { headline, subCategory, category }
  }
}
