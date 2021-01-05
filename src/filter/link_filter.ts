import Link from "../link_collection/link"

export default abstract class LinkFilter {
  constructor(public link: Link) {}
  /**
   * @returns {boolean}
   */
  abstract isLinkValid(): boolean
}
