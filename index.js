function convert (s) {
  const re = rf()
  s = s.replace(re, quote)
  return s
}

function quote (...args) {
  let result
  const m = args[args.length - 1]
  // console.log('quote function %o', m)
  if (m.dq) {
    result = m.dq
  } else {
    let s = m.square
    s = s.replace(/\\/g, `\\\\`)
    s = s.replace(/"/g, `\\"`)
    result = '"' + s + '"'
  }
  // console.log('quote returning', result)
  return result
}

module.exports = { convert }

/*

To edit, copy this down below, then remove whitespace:

function rf () {
  return /
    (?<dq>
       "
       ( [^"\\] | (\\") | \\ )*
       "
    )
    |
    (
       \[
       (?<square>
          (
             [^ [ \] ]
             |
             (
               \[
                   [^ [ \] ]*
               \]
             )
          )*
       )
       \]
    )
  /g
}
*/

function rf () {
  return /(?<dq>"([^"\\]|(\\")|\\)*")|(\[(?<square>([^[\]]|(\[[^[\]]*\]))*)\])/g
}
