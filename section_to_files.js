const config = require('./config')

const cheerio = require('cheerio')
const request = require('request')
const async = require('async')

const fs = require('fs')
const path = require('path')

function section_to_files(section) {
  async.forEach(section.links, (link) => {
    request(config.URL + link.href.slice(1), (err, head, body) => {
      process_page(body, `${section.title} -- ${link.title}`, 'txt')
    })
  })
}

module.exports = section_to_files

function process_page(body, filename, ext) {
  let $ = cheerio.load(body)
  let title = $('.entry-title').text()
  let article = title + '\n' + '-'.repeat(title.length) + '\n'

  $('.entry-content').children().each((i, chunk) => {
    if(chunk.tagName === 'h3') {
      article += $(chunk).text().toUpperCase() + '\n'
    } else if(chunk.tagName === 'p') {
      article += $(chunk).text() + '\n \n'
    }
  })

  let final_path = path.normalize(`./${config.DIST}/${filename}.${ext}`)

  fs.writeFile(final_path, article), (err) => {};
}
