# key-selector

Used for accessing nested object [ Inspired by `querySelector` / `querySelectorAll` ]

## Usage
```
// input must to be [typeof input === 'object']
// keys must be string[] or string (automatically split by ' ')

keySelector(input, keys, defaultValue? : null)
// return first posible value of keys if found, if not return null or default value

keySelectorAll(input, keys, defaultValue? : [])
// return all possible value of keys if found, if not return [] or default value
```

## Example
```
const { keySelector, keySelectorAll } = require('./index')
const obj = {
  key1: {
    key2: [
      {
        key3: 'string',
      },
      {
        key4: 110.05,
      },
      {
        key5: true,
        key6: null
      },
      {
        key7: {
          key8: 'str'
        }
      }
    ],
    key4: 'another key4'
  },
  key7: {
    key2: [
      {
        key3: 'test'
      }
    ]
  }
}

...

keySelector(obj, 'key3')                   // 'string'
keySelector(obj, 'key2[1]')                // { key4: 110.5 }
keySelector(obj, ['key2', 'key5'])         // true
keySelector(obj, 'key7')                   // { key8: 'str' }
keySelector(obj, 'key7 key3')              // 'test'
keySelector(obj, ['key7', 'key1'], {})     // {}

keySelectorAll(obj, 'key3')                // ['string', 'test']
keySelectorAll(obj, 'key2[1]')             // [{ key4: 110.5 }]
keySelectorAll(obj, ['key2', 'key5'])      // [true]
keySelectorAll(obj, 'key7')                // [{ key8: 'str' }, { key2: [{ key3: 'test }] }]
keySelectorAll(obj, 'key7 key3')           // ['test']
keySelectorAll(obj, 'key7 key1', [])       // []
```
