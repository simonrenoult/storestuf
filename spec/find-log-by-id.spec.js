const test = require('ava')
const { api } = require('./helpers')

test('returns 200', async t => {
  const response = await api().get('/logs')
  t.is(response.status, 200)
})

test('returns the list of items', async t => {
  const response = await api(['foo', 'bar']).get('/logs')
  t.deepEqual(response.body, ['foo', 'bar'])
})
