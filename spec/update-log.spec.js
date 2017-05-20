const test = require('ava')
const moment = require('moment')
const { api, fixtures } = require('./helpers')

test('returns 404 when log is missing', async t => {
  const response = await api().put('/logs/missing')
  t.is(response.status, 404)
})

test('returns 400 when author is missing', async t => {
  const body = fixtures.log().without('author')
  const response = await api([{id: '123'}]).put('/logs/123').send(body)
  t.is(response.status, 400)
})

test('returns 400 when content is missing', async t => {
  const body = fixtures.log().without('content').assign('id', '123')
  const response = await api([{id: '123'}]).put('/logs/123').send(body)
  t.is(response.status, 400)
})

test('returns 400 when id is missing', async t => {
  const body = fixtures.log().without('id')
  const response = await api([{id: '123'}]).put('/logs/123').send(body)
  t.is(response.status, 400)
})

test('returns 400 when trying to change createdAt field', async t => {
  const existingLog = fixtures.log().assign('id', '123').toJSON()
  const newLog = Object.assign({}, existingLog, {createdAt: 'foobar'})
  const response = await api([existingLog]).put('/logs/123').send(newLog)
  t.is(response.status, 400)
})

test('returns 400 when id is different than the original', async t => {
  const body = fixtures.log().assign('id', '124')
  const response = await api([{id: '123'}]).put('/logs/123').send(body)
  t.is(response.status, 400)
})

test('returns 200 when everything is fine', async t => {
  const log = fixtures.log().assign('id', '123').assign('author', 'someone else')
  const response = await api([log]).put('/logs/123').send(log)
  t.is(response.status, 200)
})

test('updates the log in the store', async t => {
  const existingLog = fixtures.log().assign('id', '123').toJSON()
  const newLog = Object.assign({}, existingLog, {author: 'somoene else'})
  const store = [existingLog]
  await api(store).put('/logs/123').send(newLog)
  t.deepEqual(store[0].author, 'somoene else')
})

test('updates the "updatedAt" field', async t => {
  const log = fixtures.log().assign('id', '123').toJSON()
  const store = [log]
  const response = await api(store).put('/logs/123').send(log)
  t.true(moment(store[0].updatedAt).isAfter(log.updatedAt))
  t.is(response.status, 200)
})

test('updates the "tags" field', async t => {
  const existingLog = fixtures.log().assign('id', '123').toJSON()
  const newLog = Object.assign({}, existingLog, {tags: ['new tag']})
  const store = [existingLog]
  await api(store).put('/logs/123').send(newLog)
  t.deepEqual(store[0].tags, ['new tag'])
})
