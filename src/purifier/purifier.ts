import Link from "../link_collection/link"

export default abstract class Purifier {
  constructor(public html: string, public link: Link) {}
  // eslint-disable-next-line @typescript-eslint/ban-types
  abstract purify(): object
  abstract persistPurified(): void
}
