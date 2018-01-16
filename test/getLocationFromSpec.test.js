import getLocationFromSpec from '../src/getLocationFromSpec'
import { locationsEqual } from '../src/utils'
import { parsePath } from 'history'
import routes from './routes'

const initLocation = parsePath('/')
const locationEqualsPath = (a, b) => locationsEqual(a, parsePath(b))

describe('Home Page', () => {
  test('creates location', () => {
    const spec = { route: 'home' }
    const location = getLocationFromSpec(routes, initLocation, spec)

    expect(locationEqualsPath(location, '/')).toEqual(true)
  })
})

describe('User Page', () => {
  test('creates location with required path param (with parsing)', () => {
    const spec = { route: 'user', params: { userId: 123 } }
    const location = getLocationFromSpec(routes, initLocation, spec)

    expect(locationEqualsPath(location, '/user/123')).toEqual(true)
  })
})

describe('Users Page', () => {
  test('creates location with optional path and query params', () => {
    const spec = {
      route: 'users',
      params: { role: 'admin', nameQuery: 'john' },
    }
    const location = getLocationFromSpec(routes, initLocation, spec)

    expect(
      locationEqualsPath(location, '/users/admin?name_query=john'),
    ).toEqual(true)
  })

  test('creates location without query param when query param value is not provided', () => {
    const spec = { route: 'users', params: { role: 'admin' } }
    const location = getLocationFromSpec(routes, initLocation, spec)

    expect(locationEqualsPath(location, '/users/admin')).toEqual(true)
  })

  test('creates location without optional path param when optional path param value is not provided', () => {
    const spec = { route: 'users', params: { nameQuery: 'john' } }
    const location = getLocationFromSpec(routes, initLocation, spec)

    expect(locationEqualsPath(location, '/users?name_query=john')).toEqual(true)
  })
})

describe('No Change', () => {
  test('location does not change when an invalid route is provided', () => {
    const spec = { route: 'nonsense' }
    const location = getLocationFromSpec(routes, initLocation, spec)

    expect(locationsEqual(location, initLocation)).toEqual(true)
  })
})
