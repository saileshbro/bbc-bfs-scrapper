import Link from "../link_collection/link"
const robotsParser = require("robots-parser")

export class RobotsParser {
  /**
   * The constructor for RobotsParser class
   * @param {Link} link - The url to which the robots.txt string belongs
   * @param {string} robotsTXT - The robots.txt string of the url
   */
  constructor(link, robotsTXT) {
    /**
     * The link pbject for which to fetch the robots.txt document
     * @type {string}
     * @private
     */
    this._url = new Link(link.baseURL, "robots.txt").resolve()

    /**
     * The rotots.txt parser from "robots-parser"
     * @type {Robots}
     * @private
     */
    this._parser = robotsParser(this._url, robotsTXT)
  }
  /**
   * Check whether the given url is scrapable by the optional user-agent
   * @param {Link} link - The url to test for scrapability
   * @param {string} [userAgent = *] - The user-agent to test for scrapability
   * @returns {boolean}
   */
  isDisallowed(link, userAgent = "*") {
    return this._parser.isDisallowed(link.resolve, userAgent)
  }
  /**
   * Get the crawl delay of the url for a given user-agent
   * @param {string} [userAgent = *] - The bot to test for
   * @returns {number}
   */
  getCrawlDelay(userAgent = "*") {
    return this._parser.getCrawlDelay(userAgent)
  }
}
/**
 * A cache for the robots.txt files.
 * This cache is maintained to avoid re-requesting robots.txt for a site
 * @class
 */
export class RobotsCache {
  /**
   * The constructor for creating the cache object
   * It takes no arguments as the robots.txt object is
   * pushed to the cache later using the "update" method.
   */
  constructor() {
    /**
     * This property holds the bundle of link and robots.txt for the given link
     * @type {LinkRobotBundle[]}
     * @private
     */
    this._cache = {}
  }
  /**
   * Update the existing cache with new link and its corresponding
   * robots.txt string
   * @param {Link} link - The link for the robots.txt string
   * @param {string} robotsTXT - The robots.txt string for the link
   */
  update(link, robotsTXT) {
    if (link.baseURL === undefined) throw new Error("Invalid link!")
    if (typeof robotsTXT !== "string") throw new Error("Invalid robots.txt!")
    this._cache[link.baseURL] = robotsTXT
  }

  /**
   * Check whether the robots.txt for given link already exists
   * @param {Link} link - The link object for the required url
   * @returns {string|undefined}
   */
  findRobotFor(link) {
    return this._cache[link.baseURL]
  }
}
