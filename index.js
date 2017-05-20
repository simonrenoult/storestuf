const express = require('express')
const shortid = require('shortid')
const bodyParser = require('body-parser')
const moment = require('moment')
const helmet = require('helmet')
const cors = require('cors')

const addLog = (store) => (req, res) => {
  if (!req.body.author) return res.status(400).send('Field "author" is required')
  if (!req.body.content) return res.status(400).send('Field "content" is required')
  const id = shortid.generate()
  const createdAt = moment().toISOString()
  const updatedAt = moment().toISOString()
  const tags = []
  const log = Object.assign({}, {updatedAt, createdAt, tags}, req.body, {id})
  store.push(log)
  res.location(`/logs/${id}`).status(201).send()
}

const findLogById = (store) => (req, res) => {
  const log = store.find(log => log.id === req.params.id)
  if (!log) return res.status(404).send()
  res.send(log)
}

const findAllLog = (store) => (req, res) => {
  res.send(store)
}

const removeAllLog = (store) => (req, res) => {
  store = store.splice(0, store.length)
  res.status(204).send()
}

const removeLogById = (store) => (req, res) => {
  const log = store.find(log => log.id === req.params.id)
  if (!log) return res.status(404).send()
  const logIndex = store.findIndex(log => log.id === req.params.id)
  store.splice(logIndex, 1)
  res.status(204).send()
}

const updateLogBiId = (store) => (req, res) => {
  const log = store.find(log => log.id === req.params.id)
  if (!log) return res.status(404).send()
  if (!req.body.id) return res.status(400).send('Field "id" is required')
  if (!req.body.author) return res.status(400).send('Field "author" is required')
  if (!req.body.content) return res.status(400).send('Field "content" is required')
  if (req.body.id !== req.params.id) return res.status(400).send('Field "id" must not change')
  if (req.body.createdAt !== log.createdAt) return res.status(400).send('Field "createdAt" cannot be modified')

  const logIndex = store.findIndex(log => log.id === req.params.id)
  store.splice(logIndex, 1)

  const updatedAt = moment().toISOString()
  store.push(Object.assign({}, req.body, {updatedAt}))

  res.send()
}

module.exports = (store = []) => {
  const app = express()

  app.use(bodyParser.json())
  app.use(helmet())
  app.use(cors())

  app.post('/logs', addLog(store))
  app.get('/logs', findAllLog(store))
  app.get('/logs/:id', findLogById(store))
  app.put('/logs/:id', updateLogBiId(store))
  app.delete('/logs', removeAllLog(store))
  app.delete('/logs/:id', removeLogById(store))

  return app
}
