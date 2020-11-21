import Purifier from "../purifier"
import * as cheerio from "cheerio"
import Axios from "axios"
import Link from "../../link_collection/link"

export default class BBCPurifier extends Purifier {
  /**
   *
   * @param {string} html
   * @param {Link} link
   */
  constructor(html, link) {
    super(html, link)
  }
  purify() {
    const $ = cheerio.load(this.html)
    let headline, subCategory, category
    if (this.link.resolve().startsWith("https://www.bbc.com/sport/")) {
      headline = $("article > header > h1")?.text() ?? ""
      subCategory = $(".story-info > span > a")?.text() ?? ""
      category =
        $(`meta[property="og:site_name"]`)
          .attr("content")
          ?.trim()
          .split(" ")[1] ?? ""
    }
    if (this.link.resolve().startsWith("http://www.bbc.com/travel/story/")) {
      category = $(`a[id="brand"]`)?.text() ?? ""
      headline = $(`meta[property="og:title"]`)?.attr("content") ?? ""
      subCategory =
        $(".seperated-list.context-heading-list > .seperated-list-item > span")
          ?.text()
          ?.trim() ?? ""
    }
    if (
      this.link.resolve().startsWith("https://www.bbc.com/culture/article/") ||
      this.link.resolve().startsWith("https://www.bbc.com/worklife/article/")
    ) {
      category =
        $(`meta[name="twitter:site"]`)?.attr("content").replace("@BBC_", "") ??
        ""
      headline = $(`meta[property="og:title"]`)?.attr("content") ?? ""
      subCategory = $("div.article-labels >a:last-child")?.text()?.trim() ?? ""
    }
    if (this.link.resolve().startsWith("https://www.bbc.com/future/article/")) {
      category =
        $(`meta[name="twitter:site"]`)?.attr("content").replace("@BBC_", "") ??
        ""
      headline = $(`meta[property="og:title"]`)?.attr("content") ?? ""
      subCategory = $("div.article-labels >a:last-child")?.text()?.trim() ?? ""
    }
    if (this.link.resolve().startsWith("https://www.bbc.com/news/av/")) {
      headline = $(`meta[property="og:title"]`)?.attr("content") ?? ""
      category =
        $(`meta[property="og:site_name"]`)
          .attr("content")
          ?.trim()
          .split(" ")[1] ?? ""
      subCategory =
        $(`a[href^="/news/"] > span[aria-hidden="false"]`)?.text() ?? ""
    }
    if (this.link.resolve().startsWith("https://www.bbc.com/news/")) {
      headline = $(`meta[property="og:title"]`)?.attr("content") ?? ""
      category =
        $(`meta[property="og:site_name"]`)
          .attr("content")
          ?.trim()
          .split(" ")[1] ?? ""
      subCategory = $(`meta[property="article:section"]`)?.attr("content") ?? ""
    }
    this._dataObject = { headline, subCategory, category }
  }
  async persistPurified() {
    if (
      this._dataObject.category &&
      this._dataObject.headline &&
      this._dataObject.subCategory
    ) {
      this._dataObject.url = this.link.resolve()
      // check existing
      const isExists = await Axios.get(
        `http://localhost:8080/articles?url=${this._dataObject.url}`
      )
      if (isExists.data.length === 0) {
        await Axios.post("http://localhost:8080/articles", this._dataObject)
        console.log(`😍 Saved successfully`)
      }
    } else {
      await Axios.post("http://localhost:8080/purifierErrorLinks", {
        url: this.link.resolve(),
      })
      console.log("🙄", "Purifier Improvement Needed")
    }
  }
}
