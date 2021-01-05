import { expect } from "chai"
import Link from "../src/link_collection/link"
describe("Link", function () {
  context("#resolve()", function () {
    it("should return https://wikipedia.org/", function () {
      expect(new Link("https://wikipedia.org", "/").resolve()).to.equal(
        "https://wikipedia.org/"
      )
    })

    it("should return https://wikipedia.org/", function () {
      expect(new Link("https://wikipedia.org").resolve()).to.equal(
        "https://wikipedia.org/"
      )
    })
  })

  context("#baseURL getter", function () {
    it("should return the baseURL", function () {
      expect(new Link("https://wikipedia.org").baseURL).to.equal(
        "https://wikipedia.org"
      )
    })
  })

  context("#path getter", function () {
    it("should return the path", function () {
      expect(new Link("https://wikipedia.org", "/nodejs").path).to.equal(
        "/nodejs"
      )
    })
  })

  context("#isEqual", function () {
    const link1 = new Link("https://www.npmjs.com", "/package/request")
    const link2 = new Link("https://www.npmjs.com", "/package/request")
    const link3 = new Link("https://en.wikipedia.org")
    it("should return true", function () {
      expect(link1.isEqual(link2)).to.be.true
    })

    it("should return true", function () {
      expect(link3.isEqual(link3)).to.be.true
    })

    it("should return false", function () {
      expect(link1.isEqual(link3)).to.be.false
    })
  })
})
