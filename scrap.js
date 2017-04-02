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
  let dist_path = path.normalize('./' + config.DIST);

  $('#primary>ul>li').each((i, section) => {
    sections.push(parse_century($, section))
  })

  if( ! fs.existsSync(dist_path)) fs.mkdir(dist_path)

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
