import Link from "./link_collection/link"
import Server from "./scraper/server"
const server = new Server()
const link = new Link("https://www.bbc.com")
;(async () => {
  try {
    const seeds = []
    seeds.push(link)
    server.start(seeds)
  } catch (error) {
    console.log(error)
  }
})()
