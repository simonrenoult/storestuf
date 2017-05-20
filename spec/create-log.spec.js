const test = require('ava')
const { api } = require('./helpers')

test('returns 400 when author is missing', async t => {
  const log = {content: 'lorem ipsum'}
  const response = await api().post('/logs').send(log)
  t.is(response.status, 400)
})

test('returns 400 when content is missing', async t => {
  const log = {author: 'foobar'}
  const response = await api().post('/logs').send(log)
  t.is(response.status, 400)
})

test('returns 201 when everything is fine', async t => {
  const log = {author: 'foobar', content: 'foobar'}
  const response = await api().post('/logs').send(log)
  t.is(response.status, 201)
})

test('returns the resource location', async t => {
  const log = {author: 'foobar', content: 'foobar'}
  const response = await api().post('/logs').send(log)
  t.regex(response.headers.location, /\/logs\/.+/)
})

test('adds the log to the store', async t => {
  const log = {author: 'foobar', content: 'foobar'}
  const store = []
  await api(store).post('/logs').send(log)
  t.deepEqual(store.length, 1)
})

test('api adds a "createdAt" field to the log', async t => {
  const log = {author: 'foobar', content: 'foobar'}
  const store = []
  const response = await api(store).post('/logs').send(log)
  const logId = response.headers.location.slice('/logs/'.length)
  const addedLog = store.find(log => log.id === logId)
  t.true('createdAt' in addedLog)
})

test('api adds a "updatedAt" field to the log', async t => {
  const log = {author: 'foobar', content: 'foobar'}
  const store = []
  const response = await api(store).post('/logs').send(log)
  const logId = response.headers.location.slice('/logs/'.length)
  const addedLog = store.find(log => log.id === logId)
  t.true('updatedAt' in addedLog)
})

test('initializes tags to empty array when not provided', async t => {
  const log = {author: 'foobar', content: 'foobar'}
  const store = []
  const response = await api(store).post('/logs').send(log)
  const logId = response.headers.location.slice('/logs/'.length)
  const addedLog = store.find(log => log.id === logId)
  t.deepEqual(addedLog.tags, [])
})

test('preserves tags value when provided', async t => {
  const log = {author: 'foobar', content: 'foobar', tags: ['foo', 'bar']}
  const store = []
  const response = await api(store).post('/logs').send(log)
  const logId = response.headers.location.slice('/logs/'.length)
  const addedLog = store.find(log => log.id === logId)
  t.deepEqual(addedLog.tags, ['foo', 'bar'])
})
