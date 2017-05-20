const test = require('ava')
const { api } = require('./helpers')

test('returns 404 when log does not exist', async t => {
  const response = await api().get('/logs/missing')
  t.is(response.status, 404)
})

test('returns 200 when log exists', async t => {
  const response = await api([{id: '123'}]).get('/logs/123')
  t.is(response.status, 200)
})

test('returns the selected log', async t => {
  const log = {id: '123', author: 'foobar', content: 'hello'}
  const response = await api([log]).get('/logs/123')
  t.deepEqual(response.body, log)
})
