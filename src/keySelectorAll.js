const { findKey } = require('./helperFunc')

/**
 * @name keySelectorAll
 * @description Find value for keys (using like query selector)
 * @param {*} object
 * @param {(string|string[])} keys
 * @param {*} defaultValue
 *
 * @returns {(Array|*|[])} resolved value or default value or []
 */
function keySelectorAll (input, keys, defaultValue = []) {
  if (typeof input !== 'object' && !Array.isArray(input)) {
    throw new Error('input need to be a Object or Array')
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

  return result.length ? result : defaultValue
}

module.exports = keySelectorAll
