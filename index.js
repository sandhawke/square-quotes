
const [balancedPattern, bothPattern] = makeRE()

// console.log({bothPattern})

function convert (s, rewrite = requote) {
  s = s.replace(bothPattern, rewrite)
  return s
}

function safeInBrackets (s) {
  s = s.replace(balancedPattern, '')
  if (s.match(/[[\]]/)) return false
  return true
}

function wrap (s) {
  if (safeInBrackets(s)) {
    return '[' + s + ']'
  }
  return wrapInQuotes(s)
}

function wrapInQuotes (s) {
  s = s.replace(/\\/g, `\\\\`) // replace a \ with a \\ (despite appearances)
  s = s.replace(/"/g, `\\"`) // prefix any embedded quotes with \
  s = s.replace(/\n/g, `\\n`) // turn any real newlines into \n
  const result = '"' + s + '"'
  return result
}

function requote (text, ...args) {
  let result
  const m = args[args.length - 1]
  // console.log('requote function %o', m)
  if (m.dq) {
    console.assert(text.startsWith('"'))
    console.assert(text.endsWith('"'))
    result = text
  } else {
    console.assert(text.startsWith('['))
    console.assert(text.endsWith(']'))
    result = wrapInQuotes(text.slice(1, -1))
  }
  // console.log('quote returning', result)
  return result
}

// I believe the cost of raising maxNesting is small and linear, in
// memory for storing the regexp and initializing it. Let's confirm.
function makeRE (maxNesting = 10) {
  // Remember in strings, unlike RE notation, we need to escape
  // backslashes.  So an RE-escaped leftbracket is written as '\\['
  // and a literal backslash character in the data will be matched by
  // \\\\

  // match a double-quoted string, like "hello" or "Hello, \"World\""
  // and return value, including the quotes, in group named "dq"
  const dq = `
    (?<dq>
       "
       (?: 
           [^"\\\\] | 
           (?: \\\\ .) |
       )*
       "
    )
  `

  const nest = []

  nest[0] = ''

  // build up nested versions, like
  // nest[1]: Hello, [World],
  // nest[2]: [Hello, [World]]
  // nest[5]: [[[[[a]]]]]
  for (let i = 1; i <= maxNesting; i++) {
    nest[i] = `
      (?: 
        \\[
          (?:
             [^ [ \\] ]
          |
             ${nest[i - 1]}
          )*
        \\]
      )
    `
  }

  const or = '\n|\n'
  const balanced = nest.slice(1).join(or)
  const both = dq + or + balanced

  const strippedBalanced = balanced.replace(/[ \n]/g, '')
  const strippedBoth = both.replace(/[ \n]/g, '')

  // console.log({strippedBalanced, strippedBoth})
  // console.log(JSON.stringify({strippedBalanced, strippedBoth}))

  return [new RegExp(strippedBalanced, 'g'),
    new RegExp(strippedBoth, 'g')]
}

module.exports = { convert, safeInBrackets, wrap, makeRE }
