const test = require('ava')
const { api, fixtures } = require('./helpers')

test('returns 404 when log does not exist', async t => {
  const response = await api().delete('/logs/missing')
  t.is(response.status, 404)
})

test('returns 204 when everything is fine', async t => {
  const log = fixtures.log().assign('id', '123')
  const response = await api([log]).delete('/logs/123')
  t.is(response.status, 204)
})

test('remove the item', async t => {
  const store = [fixtures.log().assign('id', '123').toJSON()]
  await api(store).delete('/logs/123')
  t.deepEqual(store, [])
})
