"use strict"

const { expect } = require("chai")
const Server = require("../src/scraper/server")
const Spider = require("../src/scraper/spider")

const server = new Server()

describe("Server", function() {
  context("#spawnSpider", function() {
    let spider = server._spawnSpider()
    it("should return a promise", function() {
      expect(spider instanceof Promise).to.be.true
    })
    it("should resolve to a Spider object", function() {
      spider.then(value => {
        expect(value instanceof Spider).to.be.true
      })
    })
  })
})
