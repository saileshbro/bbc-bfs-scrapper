import { launch, Browser, Page, HTTPRequest } from "puppeteer"

export default class HeadlessBrowser {
  private _browser?: Browser
  static _instance: HeadlessBrowser = new HeadlessBrowser()
  async initialize(): Promise<void> {
    this._browser = await launch()
  }
  async close(): Promise<void> {
    await this._browser?.close()
  }
  async page(): Promise<Page | void> {
    if (this._browser) {
      const page = await this._browser.newPage()
      page.setDefaultNavigationTimeout(0)
      await page.setRequestInterception(true)
      page.on("request", (request: HTTPRequest) => {
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
  }
  /**
   * @returns {HeadlessBrowser}
   */
  static get instance(): HeadlessBrowser {
    if (!HeadlessBrowser._instance) {
      HeadlessBrowser._instance = new HeadlessBrowser()
    }
    return HeadlessBrowser._instance
  }
  get browser(): Browser | undefined {
    return this._browser
  }
}
