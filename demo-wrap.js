const sq = require('square-quotes')

console.log(sq.wrap('"hello!"'))
// => ["hello!"]

console.log(sq.wrap('[a]'))
// => [[a]]

console.log(sq.wrap('[a"'))
// => "[a\""   fall back to normal quotes if necessary



