const fs = require('fs')
const map = require('lodash-node/modern/collections/map')
const sortBy = require('lodash-node/modern/collections/sortBy')
const csv = require('to-csv')
const path = require('path')
var words = {}, word

const files = [
  {name: './data/josephus.txt',totalWords: 468000},
  {name: './data/philo.txt',totalWords: 438000},
  {name: './data/lxx.txt',totalWords: 623680}
]

files.forEach(function(file) {
  var lines = fs.readFileSync(file.name).toString().replace('\r','\n').split("\n")
  lines.forEach(function(line) {
    var parts = line.split('=')
    const total = parseInt(parts[parts.length - 1])
    parts.pop()
    parts = parts.join(' = ').split('\t')
    const lemma = parts.shift()
    if(!parts.length) return
    const english = parts.pop().trim().replace(/\"/g,"")
    const qualification = parts.length ? parts[0].replace(/\(|\)/g,'').trim() : ''

    if(!lemma) return

    if(typeof words[lemma] === 'undefined') {
      words[lemma] = {
        lemma: lemma,
        total: 0,
        english: JSON.stringify(english),
        qualification: JSON.stringify(qualification)
      }
    }

    words[lemma].total += total
    words[lemma][path.basename(file.name,'.txt')] = total
  })
})

var data = csv(sortBy(map(words), function(word) {
  return word.total
}).reverse())

fs.writeFileSync('dist/mashup.csv',data)
