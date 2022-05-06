const _ = require('lodash')

function findIndice (str, key) {
  const arr = []
  let index = -1
  let start = 0
  do {
    index = str.indexOf(key, start)
    if (index !== -1) {
      arr.push(index)
    }
    start = index + 1
  } while (index !== -1 && start <= str.length)
  return arr
}

function findKey (objs, key) {
  const arrOut = []
  for (const obj of objs) {
    if (typeof obj !== 'object' && !Array.isArray(obj)) {
      continue
    }
    const str = JSON.stringify(obj)
    const indice = findIndice(str, `"${key}":`)
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
      } else if (!isNaN(parseFloat(str[index]))) {
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
  return parseFloat(arr.join(''))
}

function findString (str, index) {
  const arr = []
  let count = 0
  for (let i = index; i < str.length; i++) {
    if (['"'].includes(str[i])) {
      count++
      if (count === 2) {
        break
      }
      continue
    }
    arr.push(str[i])
  }
  return arr.join('')
}

module.exports = {
  findKey
}
