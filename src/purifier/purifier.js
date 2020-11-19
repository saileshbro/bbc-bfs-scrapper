export default class Purifier {
  /**
   * Purify the html string into an Article object
   * @returns {object}
   */
  purify() {
    throw new Error("Purifier Error! Abstract Method!")
  }
  persistPurified() {
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
