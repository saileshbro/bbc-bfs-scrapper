import Link from "../link_collection/link"
import BBCFilter from "./filters/bbc_filter"
import LinkFilter from "./link_filter"

export default class FilterFactory {
  /**
   * Returns LinkFilter instance for a link
   * @param {Link} link - The key to identify the kind of factory
   * @returns {LinkFilter} - The concrete LinkFilter object
   */
  static createFilter(link) {
    if (link.baseURL.includes("bbc.com")) {
      return new BBCFilter(link)
    } else {
      return new LinkFilter(link)
    }
  }
  constructor() {
    throw new Error("Purifier Error! Abstract Method!")
  }
}
