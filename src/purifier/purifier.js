export default class Purifier {
  /**
   * Purify the html string into an Article object
   * @returns {object}
   */
  purify() {
    throw new Error("Purifier Error! Abstract Method!")
  }
  /**
   * Returns the data object to be retrived
   * @returns {object}
   */
  getObjectToBeSaved() {
    throw new Error("Purifier Error! Abstract Method!")
  }
  /**
   * @param {string} html
   * @param {Link} link
   */
  constructor(html, link) {
    this.html = html
    this.link = link
  }
}
