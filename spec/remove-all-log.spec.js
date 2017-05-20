const test = require('ava')
const { api } = require('./helpers')

test('returns 404 when the log does not exist', async t => {
  const response = await api().delete('/logs/missing')
  t.is(response.status, 404)
})

test('returns 204', async t => {
  const store = [{id: '123'}]
  const response = await api(store).delete('/logs/123')
  t.is(response.status, 204)
})

test('removes the log', async t => {
  const store = [{id: '123'}]
  await api(store).delete('/logs/123')
  t.deepEqual(store, [])
})
