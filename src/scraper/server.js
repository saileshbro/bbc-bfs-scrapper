/**
 * The server module. This module is supposed to throttle
 * The spawning of spiders
 * @module src/scraper/server
 */
import Link from "../link_collection/link"
import LinkCollection from "./../link_collection/link_collection"
import Spider from "./spider"
import { RobotsCache, RobotsParser } from "./../parsers/robot_parser"
import Axios from "axios"
import PurifierFactory from "../purifier/purifier_factory"
export default class Server {
  /**
   * Create a new Server object
   */
  constructor() {
    /**
     * The LinkCollection object used to hold links to traverse
     * @private
     * @type {LinkCollection}
     */
    this._links = LinkCollection.create()
    /**
     * The collection robots.txt parsers
     * @private
     * @type {RobotsCache}
     */
    this._robotsCache = new RobotsCache()

    /**
     * The collection of all spiders currently visiting a page
     * @private
     * @type {Spider[]}
     */
    this._spiders = []
  }
  /**
   * This method spawns a new spider to visit given link
   * @param {Link} link - The seed link to visit
   * @param {string} robotsTXT - The robots.txt file to check before spawning
   * @returns {Promise<Spider>} - Promise object represents a spider
   * @private
   */
  _spawnSpider(link, robotsTXT) {
    return new Promise((resolve, reject) => {
      let spider, crawlDelay
      let robotsParser = new RobotsParser(link, robotsTXT)
      if (robotsParser.isDisallowed(link)) {
        return reject(
          new Error(
            `Robots Error! robots.txt disallows traversing url ${link.resolve()}`
          )
        )
      }
      try {
        crawlDelay = Number(robotsParser.getCrawlDelay()) * 1000 || 1000
      } catch (error) {
        return reject(
          new Error("Robots Error! Crawl delay in robots.txt file not a number")
        )
      }
      setTimeout(() => {
        try {
          spider = Spider.spawn(link)
        } catch (error) {
          reject(error)
        }
        resolve(spider)
      }, crawlDelay)
    })
  }
  /**
   * This method spawns a new spider to visit given link
   * @param {Link} url - The seed link to get robots.txt for
   * @returns {Promise<string>} - Promise object represents the robots string
   * @private
   */
  async _getRobotsTXT(url) {
    let robotsTXT
    try {
      const resp = await Axios.get(
        new Link(url.baseURL, "robots.txt").resolve()
      )
      robotsTXT = resp.data
    } catch (err) {
      if (err.code === "EAI_AGAIN" || err.code === "ENOTFOUND") {
        throw new Error(
          `Robots Error! ${
            err.code
          }: Couldn't fetch robots.txt for ${url.resolve()}! Please check the internet connection.`
        )
      }
      throw new Error(
        `Robots Error! Couldn't fetch robots.txt for ${url.resolve()}.`
      )
    }
    return robotsTXT
  }
  /**
   * Checks if the server can safely exit
   * @returns {boolean}
   * @private
   */
  _canExit() {
    if (this._spiders.length === 0 && this._links.size === 0) return true
    return false
  }
  /**
   * Stops the server
   */
  stop() {
    clearInterval(this._timeout)
  }
  /**
   * Start the spider-spawning server
   * This method is asynchronous and doesn't return any value
   * @param {Link|Link[]} seeds - The seed links to start the server with
   */
  start(seeds) {
    this._links.enqueue(seeds)

    this._timeout = setInterval(async () => {
      let spider, newLinks, robotsTXT
      let link = this._links.dequeue()
      if (!link) return
      console.log("🍒", link.resolve())
      if ((robotsTXT = this._robotsCache.findRobotFor(link) === undefined)) {
        try {
          robotsTXT = await this._getRobotsTXT(link)
        } catch (err) {
          console.error(err.message)
          if (
            err.message.includes("EAI_AGAIN") ||
            err.message.includes("ENOTFOUND")
          ) {
            this._links.enqueue(link)
            return
          }
          robotsTXT = "User-agent: *\nAllow: /"
        }
        this._robotsCache.update(link, robotsTXT)
      }
      try {
        spider = await this._spawnSpider(link, robotsTXT)
      } catch (err) {
        console.error(err.message)
        if (this._canExit()) process.exit(2)
        return
      }
      this._spiders.push(spider)

      try {
        await spider.getNewLinks()
      } catch (err) {
        this._spiders = this._spiders.filter(
          (s) => !s.link.isEqual(spider.link)
        )
        console.error(err.message)
        if (this._canExit()) process.exit(2)
        return
      }
      console.log(`✔ ${spider.horizon.size} links collected.`)
      this._links.enqueue(spider.horizon._links)
      this._links.removeDuplicates()
      this._spiders = this._spiders.filter((s) => !s.link.isEqual(spider.link))
      console.log(`🔗 ${this._links.size} links pending.`)
      let purifier
      try {
        purifier = PurifierFactory.createPurifier(spider.html, link)
      } catch (error) {
        return console.error(error.message)
      }
      await purifier.persistPurified()
    }, 5000)
  }
}
