import Link from "./link"
/**
 * The links-collection module
 * @module src/scraper/links-collection
 */

/**
 * A collection of Link objects
 * @typedef {Object} Link - The link class
 */

/**
 * A collection of links
 * @class
 */
export default class LinkCollection {
  private _links: Link[]
  /**
   * The constructor is private
   */
  constructor(links: Link[] = []) {
    /**
     * The data structure used to store links
     * @type {Link[]}
     * @private
     */
    if (!isIterable(links)) {
      throw new Error("TypeError: argument not an iterable")
    }
    this._links = [...links]
  }
  /**
   * The iterator interface specifier for LinkCollection
   */
  [Symbol.iterator](): LinkCollectionIterator {
    return new LinkCollectionIterator(this._links)
  }
  /**
   * Create a new Link Collection
   * @returns {LinkCollection} - A new LinkCollection object
   * @static
   */
  static create(): LinkCollection {
    return new LinkCollection([])
  }
  /**
   * Return the link object at the given index
   * @param {number} index - The index of the link
   * @returns {Link|undefined} - The link object
   */
  getLink(index: number): Link | undefined {
    if (index < this._links.length) {
      return this._links[index]
    }
  }
  /**
   * Enqueue a new link or links array
   * @param {Link|Link[]} links - A Link object or an array of Link objects
   */
  enqueue(links: Link | Link[]): void {
    if (links instanceof Array || links instanceof Link)
      this._links = this._links.concat(links)
  }
  /**
   * Dequeue a new link or links array
   * @returns {Link|undefined} - The link object
   */
  dequeue(): Link | undefined {
    return this._links.shift()
  }
  /**
   * Read existing links
   * @returns {string[]} - An array of existing links
   */
  getLinksArray(): string[] {
    return this._links.map((l) => l.resolve())
  }
  /**
   * Checks if contains a link
   * @param {Link} link - A link object
   * @returns {boolean}
   */
  containsLink(link: Link): boolean {
    if (this.size === 0) return false
    for (const ln of this._links) {
      if (link.isEqual(ln)) {
        return true
      }
    }
    return false
  }
  /**
   * Checks if contains a link
   * @param {Link} link - A link object
   * @returns {number} size - The length of the collection
   */
  get size(): number {
    return this._links.length
  }
  get links(): Link[] {
    return this._links
  }
  /**
   * Remove an existing link
   * @param {Link} link - A link object
   */
  removeLink(link: Link): void {
    this._links = this._links.filter((ln) => !ln.isEqual(link))
  }
  /**
   * Removes duplicates from LinkCollection
   */
  removeDuplicates(): void {
    this._links = this._links.filter(
      (link, index, self) => self.findIndex((t) => link.isEqual(t)) === index
    )
  }
}
interface LinkCollectionIteratorObject {
  done: boolean
  value?: Link
}
class LinkCollectionIterator {
  private _links: Link[]
  private _index: number
  private _size: number
  /**
   * Returns the next item of the iterator as specified by iterator interface
   * @returns {LinkCollectionIteratorObject} - The iterator interface specified object
   */
  next(): LinkCollectionIteratorObject {
    if (this._size === 0 || ++this._index === this._size) return { done: true }
    return { value: this._links[this._index], done: false }
  }
  /**
   * Create a LinkCollection iterator object with next() method
   * @param {Link[]} links - An array of link objects
   */
  constructor(links: Link[]) {
    this._links = links
    this._index = 0
    this._size = links.length
  }
}
function isIterable(obj: Link[] | null) {
  if (obj == null) return false
  return typeof obj[Symbol.iterator] === "function"
}
