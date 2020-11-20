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
    return /([0-9])\d+/g.test(this._link.resolve())
  }
}
