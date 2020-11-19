import Link from "../link_collection/link"
import Purifier from "./purifier"
import BBCPurifier from "./purifiers/bbc_purifier"

export default class PurifierFactory {
  /**
   * Return the right purifier object
   * @param {string} html - The HTML string
   * @param {Link} link - The key to identify the kind of factory
   * @returns {Purifier} - The concrete purifier object
   */
  static createPurifier(html, link) {
    if (link.baseURL.includes("bbc.com")) {
      return new BBCPurifier(html, link)
    } else {
      throw new Error(
        "Purifier Factory Error! Could not find the right purifier."
      )
    }
  }
  constructor() {
    throw new Error("Purifier Error! Abstract Method!")
  }
}
