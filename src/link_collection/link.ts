import { URL } from "url"
/**
 * Thie link module
 * @module src/scraper/link
 */

/**
 * An abstraction of a link
 * @class
 */
export default class Link {
  private _baseURL: string
  private _path: string
  /**
   * Create a new Link Object
   */
  constructor(baseURL: string, path = "/") {
    /**
     * The base URL of the link
     * @type {string}
     * @private
     */
    this._baseURL = baseURL
    /**
     * The path of the link
     * @type {string}
     * @private
     */
    this._path = path
  }
  /**
   * Getter to get the value of this._baseURL
   * @return {string}
   */
  get baseURL(): string {
    return this._baseURL
  }
  /**
   * Getter to get the value of this._path
   * @return {string}
   */
  get path(): string {
    return this._path
  }
  /**
   * Getter to get the hostname of the url
   * @return {string}
   */
  get hostName(): string {
    return new URL(this._path, this._baseURL).hostname.replace("www.", "")
  }
  /**
   * Checks if the current link has the same base url as given link
   * @param {Link} link - The other link to test against this link
   * @returns {boolean}
   */
  hasSameBaseURL(link: Link): boolean {
    return this._baseURL === link._baseURL
  }
  /**
   * Checks if the current link is the same as the other link
   * @param {Link} link - The other link to test against this link
   * @returns {boolean}
   */
  isEqual(link: Link): boolean {
    if (!link || !(link instanceof Link)) return false
    if (this._baseURL !== link.baseURL || this._path !== link.path) return false
    return true
  }
  /**
   * Resolve the current link object into a link URL string
   * @return {string} - A link href string
   */
  resolve(): string {
    return new URL(this._path, this._baseURL).href
  }
}
