const _ = require('lodash')

function key (input, keys, defaultValue, all = false) {
  if (typeof input !== 'object') {
    throw new Error('input need to be an Object/Array')
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
    result = find(result, key, all)
    if (!result.length) {
      break
    }
  }

  return result.length ? (all ? result : result[0]) : defaultValue
}

function find (objs, fullKey, all = false) {
  const arrOut = []
  const { key, indice: arrIndice } = extractArrayIndice(fullKey)
  for (const obj of objs) {
    if (typeof obj !== 'object') {
      continue
    }
    const str = JSON.stringify(obj)
    const indice = findIndice(str, `"${key}":`, all)
    // if all = false, findIndice will return length only one
    if (!indice.length) {
      continue
    }
    for (let index of indice) {
      index += key.length + 3
      if (['{', '['].includes(str[index])) { // object and array
        let outObjArr = findObjArr(str, index)
        for (let i = 0; i < arrIndice.length; i++) {
          if (Array.isArray(outObjArr)) {
            outObjArr = outObjArr[arrIndice[i]]
          } else {
            outObjArr = undefined
            break
          }
        }
        outObjArr && arrOut.push(outObjArr)
      } else if (!arrIndice.length) {
        if (['t', 'f'].includes(str[index])) { // boolean
          arrOut.push(str[index] === 't')
        } else if (['n'].includes(str[index])) { // null
          arrOut.push(null)
        } else if (!isNaN(Number(str[index]))) { // number
          arrOut.push(findNumber(str, index))
        } else if (['"'].includes(str[index])) { // string
          arrOut.push(findString(str, index))
        }
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

function extractArrayIndice (fullKey = '') {
  const startBucket = fullKey.search(/(\[[\d]+\])+$/g)
  const key = startBucket < 0 ? fullKey : fullKey.substring(0, startBucket)
  const indice = []

  const extracted = fullKey.match(/(\[[\d]+\])+$/g)
  if (extracted) {
    for (const num of extracted[0].match(/\d+/g)) {
      const parsed = parseInt(num)
      !isNaN(parsed) && indice.push(parsed)
    }
  }

  return {
    key,
    indice
  }
}

function findIndice (str = '', key, all = false) {
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

function findObjArr (str = '', index = 0) {
  let crlBrkt = 0
  let sqrBrkt = 0

  let end = index
  while (end < str.length) {
    switch (str[end]) {
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
    end++
    if (!crlBrkt && !sqrBrkt) {
      break
    }
  }

  return JSON.parse(str.substring(index, end))
}

function findNumber (str = '', index = 0) {
  let end = index
  while (end < str.length) {
    if ([',', '}'].includes(str[end])) {
      break
    }
    end++
  }
  const out = `{"n":${str.substring(index, end)}}`
  return JSON.parse(out).n
}

function findString (str = '', index = 0) {
  let count = 0
  let end = index

  while (end < str.length) {
    if (str[end] === '\\') {
      end++
    } else if (str[end] === '"') {
      count++
    }
    end++
    if (count === 2) {
      break
    }
  }
  const out = `{"t":${str.substring(index, end)}}`
  // use JSON.parse to make it easier to handle unicode
  return JSON.parse(out).t
}

module.exports = key
