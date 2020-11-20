const puppeteer = require("puppeteer")

export default class HeadlessBrowser {
  constructor() {}
  async initialize() {
    this._browser = await puppeteer.launch({ headless: false })
  }
  async close() {
    await this._browser.close()
  }
  async page() {
    const page = await this._browser.newPage()
    page.setDefaultNavigationTimeout(0)
    await page.setRequestInterception(true)
    page.on("request", (request) => {
      if (
        ["image", "stylesheet", "font", "other"].includes(
          request.resourceType()
        )
      ) {
        request.abort()
      } else {
        request.continue()
      }
    })
    return page
  }
  /**
   * @returns {HeadlessBrowser}
   */
  static get instance() {
    if (!HeadlessBrowser._instance) {
      HeadlessBrowser._instance = new HeadlessBrowser()
    }
    return HeadlessBrowser._instance
  }
}
