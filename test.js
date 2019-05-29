const sq = require('.')
const test = require('tape')

const convert = sq.convert

test('re both', t => {
  const [bal, both] = sq.makeRE(1)

  // console.log({bal, both})

  t.equal('x'.match(both), null)
  t.assert('""'.match(both))
  t.assert('x""x'.match(both))
  t.assert('x"x"x'.match(both))
  t.assert('[]'.match(both))
  t.assert('[x]'.match(both))
  t.assert('x[x]x'.match(both))

  t.end()
})

test('re bal', t => {
  let bal = sq.makeRE(2)[0]

  //t.assert('""'.match(bal))
  t.assert('[]'.match(bal))
  // t.assert('x'.match(bal))
  t.assert('x[]'.match(bal))
  t.assert('a[b]c'.match(bal))
  t.assert('a[b[c]d]e'.match(bal))
  t.assert('a[b"[c]d]e'.match(bal))

  t.equal('['.replace(bal, 'X'), '[')
  t.equal(']'.replace(bal, 'X'), ']')
  t.equal('[]'.replace(bal, 'X'), 'X')
  
  t.end()
})

test('re nesting', t => {
  let bal

  bal = sq.makeRE(1)[0]
  t.equal('[x]'.replace(bal, 'X'), 'X')
  t.equal('[[x]]'.replace(bal, 'X'), '[X]') // beyond makeRE(1)

  bal = sq.makeRE(2)[0]
  t.equal('[x]'.replace(bal, 'X'), 'X')
  t.equal('[[x]]'.replace(bal, 'X'), 'X') 
  t.equal('[[[x]]]'.replace(bal, 'X'),  '[X]')  // beyond makeRE(2)

  bal = sq.makeRE(20)[0]
  // 20 of each
  t.equal('[[[[[[[[[[[[[[[[[[[[x]]]]]]]]]]]]]]]]]]]]'.replace(bal, 'X'), 'X')
  // 21
  t.equal('[[[[[[[[[[[[[[[[[[[[[x]]]]]]]]]]]]]]]]]]]]]'.replace(bal, 'X'), '[X]')

  // performance: will anything blow up?
  bal = sq.makeRE(100)[0]
  t.equal('[[[[[[[[[[[[[[[[[[[[x]]]]]]]]]]]]]]]]]]]]'.replace(bal, 'X'), 'X')

  // if you get up around 500 you might get errors like Regular
  // exression too large, after some seconds of churning.
  
  t.end()
})

test('basic', t => {
  t.equal(convert(`[]`), `""`)
  t.equal(convert(`[][]`), `""""`)
  t.equal(convert(`[]a[]b[]c[]d`), `""a""b""c""d`)

  t.equal(convert(`[a]`), `"a"`)
  t.equal(convert(`a[bc]d`), `a"bc"d`)
  t.equal(convert(`a[bc]d[e][]`), `a"bc"d"e"""`)

  t.end()
})

test('newlines', t => {
  t.equal(convert(`[
]`), `"\\n"`)

  t.end()
})

test('avoid content in quotes', t => {
  t.equal(convert(`"[]"`), `"[]"`)
  t.equal(convert(`"[]""[]"`), `"[]""[]"`)
  t.equal(convert(`a"[b]"c`), `a"[b]"c`)

  t.end()
})

test('nesting', t => {
  t.equal(convert(`[[]]`), `"[]"`)
  t.equal(convert(`hello [a[b]c] bye`), `hello "a[b]c" bye`)
  t.equal(convert(`hello [a]b] bye`), `hello "a"b] bye`)
  t.equal(convert(`hello [a[b] bye`), `hello [a"b" bye`)

  t.equal(convert(`[[[]]]`), `"[[]]"`)
  t.equal(convert(`[a[[]]]`), `"a[[]]"`)
  t.equal(convert(`[a[[x]]]`), `"a[[x]]"`)

  t.end()
})

test('safe', t => {
  t.assert(sq.safeInBrackets(''))
  t.assert(sq.safeInBrackets('a'))
  t.assert(sq.safeInBrackets('[]'))
  t.assert(sq.safeInBrackets('""'))
  t.assert(sq.safeInBrackets('[[[[]]]][[[x]]]y[[z]][a]'))
  t.assert(!sq.safeInBrackets('['))
  t.assert(!sq.safeInBrackets(']'))
  t.assert(!sq.safeInBrackets('a[b'))
  t.assert(!sq.safeInBrackets('a]b'))
  t.assert(!sq.safeInBrackets('1[2[3]2]1]0]'))

  t.end()
})

test('big==slow!', t=> {
  // was bug https://twitter.com/sandhawke/status/1133768561644769282
  t.equal(convert(`[             [  ]]`), `"             [  ]"`)
  t.equal(convert(`[                            []]`),
          `"                            []"`)
  
  t.end()
})
