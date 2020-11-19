"use strict"
import Axios from "axios"
import { expect } from "chai"
import Link from "../src/link_collection/link"
import { RobotsParser, RobotsCache } from "./../src/parsers/robot_parser"

describe("RobotsParser", function () {
  context("#isDisallowed", function () {
    const wikiDisallowedLinks = [
      new Link("https://en.wikipedia.org", "/wiki/Special:"),
      new Link("https://en.wikipedia.org", "/wiki/Special%3A"),
      new Link("https://en.wikipedia.org", "/wiki/%D8%AE%D8%A7%D8%B5:Search"),
      new Link("https://en.wikipedia.org", "/wiki/%D8%AE%D8%A7%D8%B5%3ASearch"),
      new Link("https://en.wikipedia.org", "/wiki/MediaWiki:Spam-blacklist"),
      new Link(
        "https://en.wikipedia.org",
        "/wiki/Wikipedia%3AArticles_for_deletion"
      ),
    ]
    const wikiAllowedLinks = [
      new Link("https://en.wikipedia.org", "/wiki/php"),
      new Link("https://en.wikipedia.org", "/wiki/nodejs"),
    ]

    it("should return true", function () {
      Axios.get("https://en.wikipedia.org/robots.txt")
        .then((body) => {
          const robotsParser = new RobotsParser(
            new Link("https://en.wikipedia.org"),
            body.data
          )
          wikiAllowedLinks.forEach((link) => {
            expect(robotsParser.isDisallowed(link)).to.be.false
          })
        })
        .catch((err) => console.log(err.message))
    })

    it("should return false", function () {
      Axios.get("https://en.wikipedia.org/robots.txt")
        .then((body) => {
          const robotsParser = new RobotsParser(
            new Link("https://en.wikipedia.org"),
            body.data
          )
          wikiDisallowedLinks.forEach((link) => {
            expect(robotsParser.isDisallowed(link)).to.be.true
          })
        })
        .catch((err) => {
          throw err
        })
    })
  })

  context("#getCrawlDelay", function () {
    it("should return 1", function () {
      Axios.get("https://twitter.com/robots.txt")
        .then((body) => {
          const robotsParser = new RobotsParser(
            new Link("https://twitter.com"),
            body.data
          )
          expect(robotsParser.getCrawlDelay()).to.equal(1)
        })
        .catch((err) => {
          throw err
        })
    })
  })
})

describe("RobotsCache", function () {
  context("#update", function () {
    const robotsCache = new RobotsCache()
    const twitter = new Link("https://twitter.com")
    const wikipedia = new Link("https://wikipedia.org")
    const nodejs = new Link("https://nodejs.org")

    it("should add robots.txt of given link to cache", function () {
      robotsCache.update(twitter, "This is the mock robots.txt of twitter")
      expect(!!robotsCache._cache[twitter.baseURL]).to.be.true
    })

    it("should contain old and add new robots.txt of given links", function () {
      robotsCache.update(wikipedia, "This is the mock robots.txt of wikipedia")
      expect(!!robotsCache._cache[twitter.baseURL]).to.be.true
      expect(!!robotsCache._cache[wikipedia.baseURL]).to.be.true
      expect(!!robotsCache._cache[nodejs.baseURL]).to.be.false
    })
  })

  context("#findRobotFor", function () {
    const robotsCache = new RobotsCache()
    const twitter = new Link("https://twitter.com")
    const wikipedia = new Link("https://wikipedia.org")
    const mockTwitterRobot = "This is a mock robots.txt for twitter"
    const mockWikiRobot = "This is a mock robots.txt for Wiki"
    robotsCache.update(twitter, mockTwitterRobot)
    robotsCache.update(wikipedia, mockWikiRobot)

    it("should return the robots.txt string", function () {
      const twitterRobot = robotsCache.findRobotFor(twitter)
      expect(twitterRobot).to.equal(mockTwitterRobot)
    })

    it("should return the robots.txt string", function () {
      const wikiRobot = robotsCache.findRobotFor(wikipedia)
      expect(wikiRobot).to.equal(mockWikiRobot)
    })
    it("should return undefined if not exists", function () {
      const wikiRobot = robotsCache.findRobotFor(new Link("www.facebook.com"))
      expect(wikiRobot).to.be.undefined
    })
  })
})
