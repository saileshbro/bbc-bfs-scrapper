import HeadlessBrowser from "./headless_browser"
import Link from "./link_collection/link"
import Server from "./scraper/server"
import yargs from "yargs"
import { hideBin } from "yargs/helpers"
const { path } = yargs(hideBin(process.argv)).argv
const server = new Server()
const init = async () => {
  await HeadlessBrowser.instance.initialize()
  try {
    server.start(seeds)
  } catch (error) {
    console.log(error)
  }
}
const seeds = []
if (path) {
  const link = new Link("https://www.bbc.com", `/${path}`)
  console.log("⌛⌛⌛⌛⌛⌛", link.resolve())

  seeds.push(link)
} else {
  const link = new Link("https://www.bbc.com")
  console.log("⌛⌛⌛⌛⌛⌛", link.resolve())

  seeds.push(link)
}
init()
