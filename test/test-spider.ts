import { expect } from "chai"
import HeadlessBrowser from "../src/headless_browser"
import Link from "../src/link_collection/link"
import LinkCollection from "../src/link_collection/link_collection"
import Spider from "../src/scraper/spider"

const link = new Link("https://en.wikipedia.org", "/wiki/Node.js")
const spider = new Spider(link)

describe("Spider class", function () {
  before(function () {
    return HeadlessBrowser.instance.initialize()
  })
  after(function () {
    return HeadlessBrowser.instance.browser?.close()
  })
  context("#spawn", function () {
    it("should return a Spider object", function () {
      const spider = Spider.spawn(link)
      expect(spider instanceof Spider).to.be.true
    })
  })
  context("#getNewLinks", function () {
    it("should return a collection of link", function () {
      spider.getNewLinks().then((data) => {
        expect(data instanceof LinkCollection).to.be.true
      })
    })

    it("should correctly handle absolute and relative urls", function () {
      let isURLValid = true
      spider.getNewLinks().then((horizon) => {
        for (const link of horizon) {
          if (link?.path.startsWith("http")) {
            isURLValid = false
            break
          }
        }
        expect(isURLValid).to.be.true
      })
    })

    it("should not have the same link as the current seed", function () {
      let isIdentical = false
      spider.getNewLinks().then((horizon) => {
        for (const link of horizon) {
          if (
            link &&
            link.baseURL === spider.link.baseURL &&
            link.path === spider.link.path
          ) {
            isIdentical = true
            break
          }
        }
        expect(isIdentical).to.be.false
      })
    })
  })
  context("#getHTML", function () {
    this.timeout(0)
    it("should get html from client side rendered website", async function () {
      const link = new Link("https://www.bbc.com", "/sport/cricket/54998739")
      const spider = Spider.spawn(link)
      await spider._scrapeHTML()
      expect(spider.html).to.not.be.undefined
      expect(spider.html).to.be.string
      expect(spider.html).to.not.be.empty
    })
  })
})
