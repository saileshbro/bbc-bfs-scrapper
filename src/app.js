import HeadlessBrowser from "./headless_browser"
import Link from "./link_collection/link"
import Server from "./scraper/server"
const server = new Server()

const link = new Link("https://www.bbc.com", "https://www.bbc.com/news/technology-54028998")
;(async () => {
  await HeadlessBrowser.instance.initialize()
  try {
    const seeds = []
    seeds.push(link)
    server.start(seeds)
  } catch (error) {
    console.log(error)
  }
})()
