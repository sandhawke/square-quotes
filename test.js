const { convert } = require('.')
const test = require('tape')

test('basic', t => {
  t.equal(convert(`[]`), `""`)
  t.equal(convert(`[][]`), `""""`)
  t.equal(convert(`[]a[]b[]c[]d`), `""a""b""c""d`)

  t.equal(convert(`[a]`), `"a"`)
  t.equal(convert(`a[bc]d`), `a"bc"d`)
  t.equal(convert(`a[bc]d[e][]`), `a"bc"d"e"""`)

  t.end()
})

test('avoid content in quotes', t => {
  t.equal(convert(`"[]"`), `"[]"`)
  t.equal(convert(`"[]""[]"`), `"[]""[]"`)
  t.equal(convert(`a"[b]"c`), `a"[b]"c`)

  t.end()
})

test('nesting one level', t => {
  t.equal(convert(`[[]]`), `"[]"`)
  t.equal(convert(`hello [a[b]c] bye`), `hello "a[b]c" bye`)
  t.equal(convert(`hello [a]b] bye`), `hello "a"b] bye`)
  t.equal(convert(`hello [a[b] bye`), `hello [a"b" bye`)

  t.end()
})

// NOT IMPLEMENTED YET.
//
// Easy enough to do a fixed number of levels.
// Impossible to do an arbitrary number with a RegExp
//
test.skip('nesting two levels', t => {
  t.equal(convert(`[[[]]]`), `"[[]]"`)

  t.end()
})
