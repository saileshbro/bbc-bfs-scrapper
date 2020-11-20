import Purifier from "../purifier"
import * as cheerio from "cheerio"
import Axios from "axios"

export default class BBCPurifier extends Purifier {
  constructor(html, link) {
    super(html, link)
  }
  purify() {
    const $ = cheerio.load(this.html)
    const headline = $("article > header > h1")?.text() ?? ""
    const subCategory = $(".story-info > span > a")?.text() ?? ""
    const category =
      $(`meta[property="og:site_name"]`)
        .attr("content")
        ?.trim()
        .split(" ")[1] ?? ""
    this._dataObject = { headline, subCategory, category }
  }
  async persistPurified() {
    if (
      this._dataObject.category &&
      this._dataObject.headline &&
      this._dataObject.subCategory
    ) {
      this._dataObject.url = this.link.resolve()
      await Axios.post("http://localhost:8080/articles", this._dataObject)
      console.log(`😍 Saved successfully`)
    } else {
      await Axios.post("http://localhost:8080/purifierErrorLinks", {
        url: this.link.resolve(),
      })
      console.log("🙄", "Purifier Improvement Needed")
    }
  }
}
