module.exports = {
  /**
 * @name keySelector
 * @description Find value for keys (using like query selector)
 * @param {*} object
 * @param {(string|string[])} keys
 * @param {*} defaultValue
 *
 * @returns {*} resolved value or default value or null
 */
  keySelector: (input, keys, defaultValue = null) => require('./lib/key')(input, keys, defaultValue, false),
  /**
 * @name keySelectorAll
 * @description Find value for keys (using like query selector)
 * @param {*} object
 * @param {(string|string[])} keys
 * @param {*} defaultValue
 *
 * @returns {Array} resolved value or default value or []
 */
  keySelectorAll: (input, keys, defaultValue = []) => require('./lib/key')(input, keys, defaultValue, true)
}
