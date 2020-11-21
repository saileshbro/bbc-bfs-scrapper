import Link from "../../link_collection/link"
import LinkFilter from "../link_filter"

export default class BBCFilter extends LinkFilter {
  /**
   * Checks if the link is valid or not
   * @param {Link} link
   */
  constructor(link) {
    super(link)
  }
  isLinkValid() {
    if (this._link.resolve().includes("live")) {
      return false
    }

    for (const url of _invalidBBCUrls) {
      if (this._link.resolve().includes(url)) {
        return false
      }
    }

    if (/([0-9])\d{3,}/g.test(this._link.resolve())) {
      return true
    } else {
      return false
    }
  }
}
const _invalidBBCUrls = [
  "www.bbc.com/travel/gallery",
  "www.bbc.com/afrique",
  "www.bbc.com/arabic",
  "www.bbc.com/azeri",
  "www.bbc.com/bengali",
  "www.bbc.com/burmese",
  "www.bbc.com/false",
  "www.bbc.com/future/bespoke",
  "www.bbc.com/gahuza",
  "www.bbc.com/hausa",
  "www.bbc.com/hindi",
  "www.bbc.com/indonesia",
  "www.bbc.com/japanese",
  "www.bbc.com/kyrgyz",
  "www.bbc.com/marathi",
  "www.bbc.com/mundo",
  "www.bbc.com/nepali",
  "www.bbc.com/news/av/election-us",
  "www.bbc.com/news/election/us2020/",
  "www.bbc.com/pashto",
  "www.bbc.com/persian",
  "www.bbc.com/portuguese",
  "www.bbc.com/reel",
  "www.bbc.com/russian",
  "www.bbc.com/sinhala",
  "www.bbc.com/somali",
  "www.bbc.com/swahili",
  "www.bbc.com/tamil",
  "www.bbc.com/turkce",
  "www.bbc.com/ukrainian",
  "www.bbc.com/urdu",
  "www.bbc.com/uzbek",
  "www.bbc.com/vietnamese",
  "www.bbc.com/weather",
  "www.bbc.com/zhongwen/simp",
]
