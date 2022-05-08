const { findKey } = require('./utils')

/**
 * @name keySelector
 * @description Find value for keys (using like query selector)
 * @param {*} object
 * @param {(string|string[])} keys
 * @param {*} defaultValue
 *
 * @returns {*} resolved value or default value or null
 */
function keySelector (input, keys, defaultValue = null) {
  if (typeof input !== 'object') {
    throw new Error('input need to be an Object')
  }

  if (typeof keys === 'string') {
    keys = keys.split(' ')
  }

  if (!Array.isArray(keys)) {
    throw new Error('keys need to be an Array')
  }
  let result = [input]
  for (const key of keys) {
    result = findKey(result, key)
    if (!result.length) {
      break
    }
  }

  return result.length ? result[0] : defaultValue
}

module.exports = keySelector
