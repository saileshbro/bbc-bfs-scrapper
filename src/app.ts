import HeadlessBrowser from "./headless_browser"
import Link from "./link_collection/link"
import Server from "./scraper/server"
const server = new Server()
const init = async () => {
  await HeadlessBrowser.instance.initialize()
  try {
    server.start(seeds)
  } catch (error) {
    console.log(error)
  }
}
const seeds: Link[] = []
const link = new Link("https://www.bbc.com")
console.log("⌛⌛⌛⌛⌛⌛", link.resolve())

seeds.push(link)
init()
