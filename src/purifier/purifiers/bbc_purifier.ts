import Purifier from "../purifier"
import * as cheerio from "cheerio"
import Axios from "axios"
import Link from "../../link_collection/link"
interface BBCDataObject {
  headline: string
  subCategory: string
  category: string
  url: string
}
export default class BBCPurifier extends Purifier {
  private _dataObject?: BBCDataObject
  /**
   *
   * @param {string} html
   * @param {Link} link
   */
  constructor(html: string, link: Link) {
    super(html, link)
  }
  purify(): BBCDataObject | Record<string, string> {
    const $ = cheerio.load(this.html)
    let headline, subCategory, category
    if (this.link.resolve().includes("www.bbc.com/news/av/")) {
      headline = $(`meta[property="og:title"]`)?.attr("content") ?? ""
      category =
        $(`meta[property="og:site_name"]`)
          .attr("content")
          ?.trim()
          .split(" ")[1] ?? ""
      subCategory =
        $(
          "article [class*='MetadataStrip'] :last-of-type [class*='MetadataContent']"
        )?.text() ?? ""
      return (this._dataObject = {
        url: this.link.resolve(),
        headline,
        subCategory,
        category,
      })
    }
    if (this.link.resolve().includes("www.bbc.com/sport/")) {
      headline = $("article > header > h1")?.text() ?? ""
      subCategory = $(".story-info > span > a")?.text() ?? ""
      category =
        $(`meta[property="og:site_name"]`)
          .attr("content")
          ?.trim()
          .split(" ")[1] ?? ""
      return (this._dataObject = {
        url: this.link.resolve(),
        headline,
        subCategory,
        category,
      })
    }
    if (this.link.resolve().includes("http://www.bbc.com/travel/story/")) {
      category = $(`a[id="brand"]`)?.text() ?? ""
      headline = $(`meta[property="og:title"]`)?.attr("content") ?? ""
      subCategory =
        $(".seperated-list.context-heading-list > .seperated-list-item > span")
          ?.text()
          ?.trim() ?? ""
      return (this._dataObject = {
        url: this.link.resolve(),
        headline,
        subCategory,
        category,
      })
    }
    if (
      this.link.resolve().includes("www.bbc.com/culture/article/") ||
      this.link.resolve().includes("www.bbc.com/worklife/article/")
    ) {
      category =
        $(`meta[name="twitter:site"]`)?.attr("content")?.replace("@BBC_", "") ??
        ""
      headline = $(`meta[property="og:title"]`)?.attr("content") ?? ""
      subCategory = $("div.article-labels >a:last-child")?.text()?.trim() ?? ""
      return (this._dataObject = {
        url: this.link.resolve(),
        headline,
        subCategory,
        category,
      })
    }
    if (this.link.resolve().includes("www.bbc.com/future/article/")) {
      category =
        $(`meta[name="twitter:site"]`)?.attr("content")?.replace("@BBC_", "") ??
        ""
      headline = $(`meta[property="og:title"]`)?.attr("content") ?? ""
      subCategory = $("div.article-labels >a:last-child")?.text()?.trim() ?? ""
      return (this._dataObject = {
        url: this.link.resolve(),
        headline,
        subCategory,
        category,
      })
    }
    if (this.link.resolve().includes("www.bbc.com/news/")) {
      headline = $(`meta[property="og:title"]`)?.attr("content") ?? ""
      category =
        $(`meta[property="og:site_name"]`)
          .attr("content")
          ?.trim()
          .split(" ")[1] ?? ""
      subCategory = $(`meta[property="article:section"]`)?.attr("content") ?? ""
      return (this._dataObject = {
        url: this.link.resolve(),
        headline,
        subCategory,
        category,
      })
    }
    return {}
  }
  async persistPurified(): Promise<void> {
    if (this._dataObject) {
      this._dataObject.category = this._dataObject.category.trim()
      this._dataObject.headline = this._dataObject.headline.trim()
      this._dataObject.subCategory = this._dataObject.subCategory.trim()
      if (this._dataObject.category && this._dataObject.headline) {
        this._dataObject
        const isExists = await Axios.get(
          `http://localhost:8080/articles?url=${this._dataObject.url}`
        )
        if (isExists.data.length === 0) {
          if (this._dataObject.subCategory) {
            await Axios.post("http://localhost:8080/articles", this._dataObject)
            console.log(`😍😍😍😍😍😍 Saved successfully`)
          } else {
            await Axios.post("http://localhost:8080/noCategory", {
              url: this.link.resolve(),
            })
            console.log(`😭😭😭😭😭😭 Subategory not found`)
          }
        }
      } else {
        await Axios.post("http://localhost:8080/purifierErrorLinks", {
          url: this.link.resolve(),
        })
        console.log("🙄🙄🙄🙄🙄🙄", "Purifier Improvement Needed")
      }
    }
  }
}
