const supertest = require('supertest')
const moment = require('moment')
const shortid = require('shortid')
const server = require('..')

exports.api = (store = []) => supertest(server(store))

exports.fixtures = {
  log () {
    const log = {
      id: shortid.generate(),
      author: 'simon.renoult@gmail.com',
      content: 'random content',
      tags: ['test'],
      createdAt: moment().toISOString(),
      updatedAt: moment().toISOString(),
      without (key) {
        delete this[key]
        return this
      },
      assign (key, value) {
        this[key] = value
        return this
      },
      toJSON () {
        const res = {}
        for (let key in this) {
          if (typeof this[key] !== 'function') {
            res[key] = this[key]
          }
        }
        return res
      }
    }
    return log
  }
}
