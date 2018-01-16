import Provider from '../src/Provider'
import React from 'react'
import createHistory from 'history/createMemoryHistory'
import renderer from 'react-test-renderer'
import routes from './routes'

export default (description, Component) => {
  describe(description, () => {
    const history = createHistory()
    const render = children =>
      renderer
        .create(
          <Provider routes={routes} history={history}>
            {children}
          </Provider>,
        )
        .toJSON()

    test('links to Home Page', () => {
      const tree = render(<Component route="home">Home</Component>)
      expect(tree).toMatchSnapshot()
    })

    test('links to User Page with required path param', () => {
      const tree = render(
        <Component route="user" params={{ userId: 123 }}>
          User 123
        </Component>,
      )
      expect(tree).toMatchSnapshot()
    })

    test('links to Users Page with optional path and query params', () => {
      const tree = render(
        <Component route="users" params={{ role: 'admin', nameQuery: 'john' }}>
          All Users
        </Component>,
      )
      expect(tree).toMatchSnapshot()
    })

    test('links to Users Page with query param', () => {
      const tree = render(
        <Component route="users" params={{ nameQuery: 'john' }}>
          All Users
        </Component>,
      )
      expect(tree).toMatchSnapshot()
    })

    test('links to Users Page with optional path param', () => {
      const tree = render(
        <Component route="users" params={{ role: 'admin' }}>
          All Users
        </Component>,
      )
      expect(tree).toMatchSnapshot()
    })
  })
}
