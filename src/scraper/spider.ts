/**
 * The Spider module:
 * This module is responsible for spawning a spider with a seed url, getting new links from a page and adding those links to a links collection.
 * @module src/scraper/spider
 */
import * as cheerio from "cheerio"
import LinkCollection from "../link_collection/link_collection"
import Link from "../link_collection/link"
import HeadlessBrowser from "../headless_browser"
import { URL } from "url"
export default class Spider {
  private _link: Link
  private _horizon: LinkCollection
  private _html?: string
  /**
   * Returns a new Spider object with link as parameter.
   * If the links collection of one spider spawned in a url is full,
   * then links collection field can be added to spawn
   * @param {Link} link - The link object for the site to be traversed
   * @returns {Spider} spider
   */
  static spawn(link: Link): Spider {
    return new Spider(link)
  }
  /**
   * Collect all links from within the seed url into a links collecton
   */
  async getNewLinks(): Promise<LinkCollection> {
    try {
      await this._scrapeHTML()
    } catch (error) {
      throw new Error(
        "Spider Error! Couldn't fetch new links! Please check the internet connection."
      )
    }
    const $ = cheerio.load(this._html ?? "")
    $("a").each((_i: number, e: cheerio.Element) => {
      const linkTag = $(e)
      if (linkTag?.attr("href") && !linkTag.attr("href")?.includes("#")) {
        let baseURL = this._link.baseURL
        let path = linkTag.attr("href") ?? ""
        if (linkTag?.attr("href")?.startsWith("http")) {
          const url = new URL($(e).attr("href") ?? "")
          baseURL = url.origin
          path = url.pathname
        }
        try {
          new URL(path, baseURL).href
          const newLink = new Link(baseURL, path)
          if (!this._link.isEqual(newLink)) {
            this._horizon.enqueue(newLink)
          }
        } catch (error) {
          console.log("🎆🎆🎆🎆🎆🎆", "Invalid url fetched")
        }
      }
    })
    this._horizon.removeDuplicates()
    return this._horizon
  }
  /**
   * @returns {LinkCollection} - The collection to which the spider adds links encountered in a page
   */
  get horizon(): LinkCollection {
    return this._horizon
  }
  /**
   * Getter for the link property
   * @returns {Link} - The link the spider is currently visiting
   */
  get link(): Link {
    return this._link
  }
  /**
   * Getter for the html property
   * @returns {string}
   */
  get html(): string {
    if (this._html === "")
      throw new Error("Spider Error! html property undefined")

    return this._html ?? ""
  }
  async _scrapeHTML(): Promise<string> {
    try {
      const page = await HeadlessBrowser.instance.page()
      if (!page) {
        throw new Error()
      }
      await page.goto(this._link.resolve(), {
        waitUntil: "networkidle2",
      })
      this._html = await page.content()
      await page.close()
      return this._html ?? ""
    } catch (error) {
      throw new Error("Headless Browser Error")
    }
  }
  /**
   * Create a new Spider object
   * @param {Link} link
   * @private
   */
  constructor(link: Link) {
    /**
     * The seed link to which to send the spider
     * @private
     * @type {Link}
     */
    this._link = link
    /**
     * The collection to which the spider adds links encountered in a page
     * @private
     * @type {LinksCollection}
     */
    this._horizon = LinkCollection.create()
  }
}
