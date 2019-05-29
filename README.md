# square-quotes
[![NPM version][npm-image]][npm-url]

Because the world needs one more way of quoting strings.

I wrote this for flextags, which needs quoting that doesn't seem like
"people" are being "cautious" with their "wording", and for use by
people who don't understand backslash-escaping.

But it might also be useful more broadly, when escaping gets
confusing. (Ironically, this code internally is a nightmare of
escaping backslashes.)

There's a fundamental result in computer science that finite automata,
like regular expression engines, can't do balancing of parentheses.
However, they can handle balancing parens N levels deep for
compile-time N. So at the moment this is implemented with a big
regexp.

## Converting from square quotes to normal quotes

Input
```plain
line before square brackets
[
Square brackets work
across newlines
with "quotes" and escaped \"quotes\"
and [with [nested [bracket [expressions]]]]
] appended text
last line
```
Command line:
```terminal
$ convert-from-square-quotes <sample.txt
line before square brackets
"\nSquare brackets work\nacross newlines\nwith \"quotes\" and escaped \\\"quotes\\\"\nand [with [nested [bracket [expressions]]]]\n" appended text
last line
```

In code:

```js
const sq = require('square-quotes')

console.log(sq.convert('Some [text] using "various" quotation [[styles]].'))
// => Some "text" using "various" quotation "[styles]".
```

## Wrapping in square quotes (aka brackets)

```js
const sq = require('square-quotes')

console.log(sq.wrap('"hello!"'))
// => ["hello!"]

console.log(sq.wrap('[a]'))
// => [[a]]

console.log(sq.wrap('[a'))
// => "[a"   fall back to normal quotes if necessary
```

[npm-image]: https://img.shields.io/npm/v/square-quotes.svg?style=flat-square
[npm-url]: https://npmjs.org/package/square-quotes
