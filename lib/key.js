const _ = require('lodash')

function key (input, keys, defaultValue, all = false) {
  if (typeof input !== 'object') {
    throw new Error('input need to be an Object')
  }

  // support to split with space
  if (typeof keys === 'string') {
    keys = keys.split(' ')
  }

  if (!Array.isArray(keys)) {
    throw new Error('keys need to be an Array')
  }

  let result = [input]
  for (const key of keys) {
    result = findKey(result, key, all)
    if (!result.length) {
      break
    }
  }

  return result.length ? (all ? result : result[0]) : defaultValue
}

function findIndice (str, key, all = false) {
  const arr = []
  let index = -1
  let start = 0
  do {
    index = str.indexOf(key, start)
    if (index !== -1) {
      arr.push(index)
      if (!all) {
        break
      }
    }
    start = index + 1
  } while (index !== -1 && start <= str.length)
  return arr
}

function findKey (objs, key, all = false) {
  const arrOut = []
  for (const obj of objs) {
    if (typeof obj !== 'object') {
      continue
    }
    const str = JSON.stringify(obj)
    const indice = findIndice(str, `"${key}":`, all)
    if (!indice.length) {
      continue
    }
    for (let index of indice) {
      index += key.length + 3
      if (['{', '['].includes(str[index])) {
        arrOut.push(findObjArr(str, index))
      } else if (['t', 'f'].includes(str[index])) {
        arrOut.push(str[index] === 't')
      } else if (['n'].includes(str[index])) {
        arrOut.push(null)
      } else if (!isNaN(Number(str[index]))) {
        arrOut.push(findNumber(str, index))
      } else if (['"'].includes(str[index])) {
        arrOut.push(findString(str, index))
      }
    }
  }

  // make result unique
  const unique = []
  for (const out of arrOut) {
    !_.some(unique, el => _.isEqual(el, out)) && unique.push(out)
  }

  return unique
}

function findObjArr (str, index) {
  let crlBrkt = 0
  let sqrBrkt = 0

  const arr = []
  for (let i = index; i < str.length; i++) {
    switch (str[i]) {
      case '{':
        crlBrkt++
        break
      case '[':
        sqrBrkt++
        break
      case '}':
        crlBrkt--
        break
      case ']':
        sqrBrkt--
        break
    }
    arr.push(str[i])
    if (!crlBrkt && !sqrBrkt) {
      break
    }
  }
  return JSON.parse(arr.join(''))
}

function findNumber (str, index) {
  const arr = []
  for (let i = index; i < str.length; i++) {
    if ([',', '}'].includes(str[i])) {
      break
    }
    arr.push(str[i])
  }
  return Number(arr.join(''))
}

function findString (str, index) {
  let count = 0
  let out = ''

  for (let i = index; i < str.length; i++) {
    if (str[i] === '\\' && i + 1 < str.length) {
      // skip to next char if str[i] === \
      i++
    } else if (str[i] === '"') {
      // count and skip double quote at start and end
      count++
      if (count === 2) {
        break
      }
      continue
    }
    out += str[i]
  }

  return out
}

module.exports = key
