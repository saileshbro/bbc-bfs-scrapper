/**
 * The server module. This module is supposed to throttle
 * The spawning of spiders
 * @module src/scraper/server
 */
import Link from "../link_collection/link"
import LinkCollection from "../link_collection/link_collection"
import Spider from "./spider"
import { RobotsCache, RobotsParser } from "../parsers/robot_parser"
import Axios from "axios"
import PurifierFactory from "../purifier/purifier_factory"
import FilterFactory from "../filter/filter_factory"
import LinkFilter from "../filter/link_filter"
export default class Server {
  private _links: LinkCollection
  private _robotsCache: RobotsCache
  private _spiders: Spider[]
  private _visitedCache: Map<string, boolean>
  private _timeout?: NodeJS.Timeout
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

    this._visitedCache = new Map<string, boolean>()
  }
  /**
   * This method spawns a new spider to visit given link
   * @param {Link} link - The seed link to visit
   * @param {string} robotsTXT - The robots.txt file to check before spawning
   * @returns {Promise<Spider>} - Promise object represents a spider
   * @private
   */
  _spawnSpider(link: Link, robotsTXT: string | undefined): Promise<Spider> {
    return new Promise((resolve, reject) => {
      let spider: Spider, crawlDelay: number
      const robotsParser = new RobotsParser(link, robotsTXT ?? "")
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
  async _getRobotsTXT(url: Link): Promise<string> {
    let robotsTXT: string
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
  _canExit(): boolean {
    if (this._spiders.length === 0 && this._links.size === 0) return true
    return false
  }
  /**
   * Stops the server
   */
  stop(): void {
    console.log("💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀")
    if (this._timeout) {
      clearInterval(this._timeout)
    }
    process.exit(0)
  }
  /**
   * Start the spider-spawning server
   * This method is asynchronous and doesn't return any value
   * @param {Link|Link[]} seeds - The seed links to start the server with
   */
  start(seeds: Link | Link[]): void {
    this._links.enqueue(seeds)
    this._timeout = setInterval(async () => {
      let spider: Spider, robotsTXT: string | undefined
      const link = this._links.dequeue()
      if (link) {
        if (this._links.size > 0) {
          try {
            const linkFilter = FilterFactory.createFilter(link)
            if (linkFilter.isLinkValid()) {
              console.log("🍒🍒🍒🍒🍒🍒", link.resolve())
            } else {
              return
            }
          } catch (error) {
            console.log(error.message)
          }
        }
        if (this._links.size > 100 && (await this.notExistsInDB(link))) {
          return
        }
        if (this._visitedCache.get(link.resolve())) {
          console.log("😎😎😎😎😎😎 Already Visited")

          return
        } else {
          this._visitedCache.set(link.resolve(), true)
        }
        robotsTXT = this._robotsCache.findRobotFor(link)
        if (!robotsTXT) {
          try {
            robotsTXT = await this._getRobotsTXT(link)
          } catch (err) {
            console.error(err.message)
            robotsTXT = "User-agent: *\nAllow: /"
          }
          this._robotsCache.update(link, robotsTXT)
        }
        try {
          spider = await this._spawnSpider(link, robotsTXT)
        } catch (err) {
          console.error(err.message)
          if (this._canExit()) {
            this.stop()
          }
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
          if (this._canExit()) {
            this.stop()
          }
          return
        }
        console.log(`🎉🎉🎉🎉🎉🎉 ${spider.horizon.size} links collected.`)

        const specialLinks = spider.horizon.links.filter((link) => {
          if (this._visitedCache.get(link.resolve())) {
            return false
          }
          try {
            const filter: LinkFilter = FilterFactory.createFilter(link)
            return filter.isLinkValid()
          } catch (error) {
            return false
          }
        })
        this._links.enqueue(specialLinks)
        this._links.removeDuplicates()
        this._spiders = this._spiders.filter(
          (s) => !s.link.isEqual(spider.link)
        )
        console.log(`🔗🔗🔗🔗🔗🔗 ${this._links.size} links pending.`)

        let purifier
        try {
          purifier = PurifierFactory.createPurifier(spider.html, link)
        } catch (error) {
          return console.error(error.message)
        }
        purifier.purify()
        try {
          await purifier.persistPurified()
        } catch (error) {
          console.log(error)
          console.log(`💩💩💩💩💩💩 Failed to save the obtained data`)
        }
        if (this._canExit()) {
          this.stop()
        }
      }
    }, 3500)
  }
  /**
   * Checks if the link and associated data already exists in database
   * @param {Link} link
   */
  async notExistsInDB(link: Link): Promise<boolean> {
    try {
      const resp = await Axios.get(
        `http://localhost:8080/articles?url=${link.resolve()}`
      )
      return resp.data.length == 0
    } catch (error) {
      return true
    }
  }
}
