const puppeteer = require("puppeteer")

export default class HeadlessBrowser {
  constructor() {}
  async initialize() {
    this._browser = await puppeteer.launch({ headless: true })
  }
  async close() {
    await this._browser.close()
  }
  async page() {
    const page = await this._browser.newPage()
    page.setDefaultNavigationTimeout(0)
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
