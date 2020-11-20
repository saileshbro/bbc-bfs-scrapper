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
      if (this._link.resolve().startsWith(url)) {
        return false
      }
    }

    if (/([0-9])\d+/g.test(this._link.resolve())) {
      return true
    } else {
      return false
    }
  }
}
const _invalidBBCUrls = [
  "http://www.bbc.com/travel/gallery",
  "https://www.bbc.com/afrique",
  "https://www.bbc.com/arabic",
  "https://www.bbc.com/azeri",
  "https://www.bbc.com/bengali",
  "https://www.bbc.com/burmese",
  "https://www.bbc.com/false",
  "https://www.bbc.com/future/bespoke",
  "https://www.bbc.com/gahuza",
  "https://www.bbc.com/hausa",
  "https://www.bbc.com/hindi",
  "https://www.bbc.com/indonesia",
  "https://www.bbc.com/japanese",
  "https://www.bbc.com/kyrgyz",
  "https://www.bbc.com/marathi",
  "https://www.bbc.com/mundo",
  "https://www.bbc.com/nepali",
  "https://www.bbc.com/news/av/election-us",
  "https://www.bbc.com/news/election/us2020/",
  "https://www.bbc.com/pashto",
  "https://www.bbc.com/persian",
  "https://www.bbc.com/portuguese",
  "https://www.bbc.com/reel",
  "https://www.bbc.com/russian",
  "https://www.bbc.com/sinhala",
  "https://www.bbc.com/somali",
  "https://www.bbc.com/swahili",
  "https://www.bbc.com/tamil",
  "https://www.bbc.com/turkce",
  "https://www.bbc.com/ukrainian",
  "https://www.bbc.com/urdu",
  "https://www.bbc.com/uzbek",
  "https://www.bbc.com/vietnamese",
  "https://www.bbc.com/weather",
  "https://www.bbc.com/zhongwen/simp",
]
