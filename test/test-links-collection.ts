import { expect } from "chai"
import Link from "../src/link_collection/link"
import LinkCollection from "../src/link_collection/link_collection"

describe("LinkCollection", function () {
  context("#create()", function () {
    const linkscol = LinkCollection.create()
    it("should return an object", function () {
      expect(linkscol).to.be.an("object")
    })
    it("should return an object having an array", function () {
      expect(linkscol).to.have.property("_links")
      expect(linkscol.links).to.be.an("array")
    })
  })

  context("#getLinksArray", function () {
    it("should return an array of urls", function () {
      const linkColln = LinkCollection.create()
      // Test initialization
      const vimAboutLink = new Link("https://vim.org", "/about")
      const nodejsDownloadLink = new Link("https://nodejs.org", "/download")
      linkColln.enqueue(vimAboutLink)
      linkColln.enqueue(nodejsDownloadLink)
      // Test body
      expect(linkColln.size).to.be.equals(2)
      expect(linkColln.getLinksArray()).to.be.an("array")
      expect(linkColln.getLinksArray()).to.deep.equals([
        "https://vim.org/about",
        "https://nodejs.org/download",
      ])
    })
  })

  context("#enqueue", function () {
    const links = [
      new Link("https://vim.org", "/about"),
      new Link("https://espn.in"),
      new Link("https://nodejs.org", "/download"),
    ]
    const linkCollection = LinkCollection.create()
    it("should not add undefined value", function () {
      expect(linkCollection.links.length).to.be.equals(0)
      linkCollection.links.forEach((link) => {
        expect(link.baseURL).to.be.a("string")
        expect(link.path).to.be.a("string")
      })
    })
    it("should add a new link object to collection", function () {
      linkCollection.enqueue(new Link("https://wikipedia.org"))
      linkCollection.links.forEach((link) => {
        expect(link.baseURL).to.be.a("string")
        expect(link.path).to.be.a("string")
      })
    })

    it("should add an array of links to collection", function () {
      linkCollection.enqueue(links)
      linkCollection.links.forEach((link) => {
        expect(link.baseURL).to.be.a("string")
        expect(link.path).to.be.a("string")
      })
    })
  })
  context("#dequeue", function () {
    const vimLink = new Link("https://vim.org", "/about")
    const espnLink = new Link("https://espn.in")

    const linkCollection = LinkCollection.create()
    linkCollection.enqueue(vimLink)
    linkCollection.enqueue([espnLink])
    it("should remove and return from front of the list", function () {
      let link = linkCollection.dequeue()
      expect(link).to.deep.equals(vimLink)
      expect(linkCollection.size).equals(1)
      link = linkCollection.dequeue()
      expect(link).to.deep.equals(espnLink)
      expect(linkCollection.size).equals(0)
      link = linkCollection.dequeue()
      expect(link).to.be.undefined
    })
  })

  context("#getLink", function () {
    const links = LinkCollection.create()
    const vimAboutLink = new Link("https://vim.org", "/about")
    const nodejsDownloadLink = new Link("https://nodejs.org", "/download")
    links.enqueue(vimAboutLink)
    links.enqueue(nodejsDownloadLink)
    it("should get the link at given index", function () {
      expect(links.getLink(0)).to.deep.equals(vimAboutLink)
      expect(links.getLink(1)).to.deep.equals(nodejsDownloadLink)
    })
  })

  context("#containsLink", function () {
    const links = LinkCollection.create()
    const link = new Link("https://medium.com")

    it("should return true", function () {
      links.enqueue(link)
      expect(links.containsLink(link)).to.be.true
    })
  })

  context("#get size()", function () {
    const links = LinkCollection.create()
    links.enqueue(new Link("https://wiki.org", "/nodejs"))
    links.enqueue(new Link("https://wiki.org", "/php"))
    links.enqueue(new Link("https://wiki.org", "/perl"))
    it("should return 3", function () {
      expect(links.size).to.equals(3)
    })
  })

  context("#removeLink", function () {
    const linkCol = LinkCollection.create()
    it("should remove the link from the collection", function () {
      const link = new Link("https://wikipedia.org")
      linkCol.removeLink(link)
      expect(linkCol.containsLink(link)).to.be.false
    })
  })

  context("#iterator interface", function () {
    const links = new LinkCollection([
      new Link("https://wiki.org", "/nodejs"),
      new Link("https://wiki.org", "/php"),
      new Link("https://wiki.org", "/perl"),
    ])
    it("should return an iterator", function () {
      for (const link of links) {
        expect(link).to.be.an("object")
        expect(link).to.not.be.undefined
        expect(link?.baseURL).to.be.a("string")
      }
    })
  })
  context("#removeDuplicates", () => {
    const links = LinkCollection.create()
    links.enqueue(new Link("https://wiki.org", "/nodejs"))
    links.enqueue(new Link("https://wiki.org", "/php"))
    links.enqueue(new Link("https://wiki.org", "/nodejs"))
    links.enqueue(new Link("https://wiki.org", "/node"))
    const linksNew = [
      new Link("https://wiki.org", "/nodejs"),
      new Link("https://wiki.org", "/php"),
      new Link("https://wiki.org", "/perl"),
    ]
    links.enqueue(linksNew)
    it("should return 4", function () {
      links.removeDuplicates()
      expect(links.size).to.equals(4)
    })
    const oldLinks = new LinkCollection([
      new Link("https://en.wikipedia.org", "/wiki/PHP"),
      new Link("https://nodejs.org"),
      new Link("https://medium.com"),
    ])
    const newLinks = [
      new Link(
        "https://en.wikipedia.org",
        "/wiki/Python_%28programming_language%29"
      ),
      new Link("https://nodejs.org"),
      new Link("https://edx.org", "/course"),
      new Link("https://en.wikipedia.org", "/wiki/PHP"),
    ]

    it("should return only non-duplicate links", function () {
      oldLinks.enqueue(newLinks)
      oldLinks.removeDuplicates()
      expect(oldLinks.size).to.equal(5)
    })
  })
})
