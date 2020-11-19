import { expect } from "chai"
import Link from "../src/link_collection/link"
import LinkCollection from "../src/link_collection/link_collection"
import Spider from "../src/scraper/spider"

const link = new Link("https://en.wikipedia.org", "/wiki/Node.js")
const spider = new Spider(link)

describe("Spider class", function () {
  context("#spawn", function () {
    it("should return a Spider object", function () {
      let spider = Spider.spawn(link)
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
        for (let link of horizon) {
          if (link.path.startsWith("http")) {
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
        for (let link of horizon) {
          if (
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
    it("should get html from client side rendered website", function () {
      const link = new Link("https://www.bbc.com", "/sport/cricket/54998739")
      const spider = new Spider(link)
      spider._scrapeHTML().then(() => {
        expect(spider.html).to.be.string
        console.log(spider.html)
        expect(spider.html.length).to.be.greaterThan(200)
      })
    })
  })
})
