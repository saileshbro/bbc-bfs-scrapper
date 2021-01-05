import Link from "../link_collection/link"
import BBCFilter from "./filters/bbc_filter"
import LinkFilter from "./link_filter"

export default class FilterFactory {
  /**
   * Returns LinkFilter instance for a link
   * @param {Link} link - The key to identify the kind of factory
   * @returns {LinkFilter} - The concrete LinkFilter object
   */
  static createFilter(link: Link): LinkFilter {
    if (link.baseURL.includes("bbc.com")) {
      return new BBCFilter(link)
    } else {
      throw new Error(`Filter for the link ${link.resolve()} not found!`)
    }
  }
  constructor() {
    throw new Error("Factory Error! Abstract Method!")
  }
}
