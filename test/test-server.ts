import Server from "../src/scraper/server"
import chai, { expect } from "chai"
import chaiPromised from "chai-as-promised"
chai.use(chaiPromised)
chai.should()
import Link from "../src/link_collection/link"
import Spider from "../src/scraper/spider"
describe("Server", function () {
  const server = new Server()
  context("#spawnSpider", function () {
    const spider = server._spawnSpider(new Link("https://facebook.com"), "*")
    it("should return a promise", function () {
      expect(spider instanceof Promise).to.be.true
    })
    it("should resolve to a Spider object", function () {
      spider.then((value) => {
        expect(value instanceof Spider).to.be.true
      })
    })
    it("should throw error when not allowed to spawn", function () {
      return expect(
        server._spawnSpider(
          new Link("https://facebook.com"),
          "User-agent: *\nDisallow: /"
        )
      ).to.be.rejected
    })
  })
})
