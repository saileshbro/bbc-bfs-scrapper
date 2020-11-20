import Link from "../link_collection/link"

export default class LinkFilter {
  /**
   * @param {Link} link
   */
  constructor(link) {
    this._link = link
  }
  isLinkValid() {
    return false
  }
}
