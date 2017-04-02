const config = require('./config')

const section_to_files = require('./section_to_files')

const request = require('request')
const cheerio = require('cheerio')
const async = require('async')

const fs = require('fs')
const path = require('path')

request(config.URL, (err, head, body) => {
  let $ = cheerio.load(body)
  let sections = []
  let dist_path = path.normalize('./' + config.DIST)
  let split_path = dist_path.split(path.sep)

  $('#primary>ul>li').each((i, section) => {
    sections.push(parse_century($, section))
  })

  for(let i = 1; i <= split_path.length; i++) {
    let chunk = split_path.slice(0, i).join(path.sep)

    if( ! fs.existsSync(chunk)) fs.mkdirSync(chunk)
  }

  async.forEach(sections, section_to_files)
})

function parse_century($, section) {
  let title = $(section).find('h3').text()
  let links = []
  $(section).find('a').each((i, link) => {
    links.push({
      href: $(link).attr('href'),
      title: $(link).text()
    })

  })
  return {
    title,
    links
  }
}
