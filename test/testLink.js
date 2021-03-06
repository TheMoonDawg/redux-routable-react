import * as messages from '../src/messages'

import Link from '../src/Link'
import Provider from '../src/Provider'
import React from 'react'
import createHistory from 'history/createMemoryHistory'
import renderer from 'react-test-renderer'
import routes from './routes'

const getLinkInstance = tree => tree.root.findByType(Link).instance

export default (description, Component) => {
  describe(description, () => {
    const history = createHistory()
    const render = children => (
      <Provider routes={routes} history={history}>
        {children}
      </Provider>
    )

    test('links to Home Page', () => {
      const tree = renderer
        .create(render(<Component route="home">Home</Component>))
        .toJSON()
      expect(tree).toMatchSnapshot()
    })

    test('links to User Page with required path param', () => {
      const tree = renderer
        .create(
          render(
            <Component route="user" params={{ userId: 123 }}>
              User 123
            </Component>,
          ),
        )
        .toJSON()
      expect(tree).toMatchSnapshot()
    })

    test('links to Users Page with optional path and query params', () => {
      const tree = renderer
        .create(
          render(
            <Component
              route="users"
              params={{ role: 'admin', nameQuery: 'john' }}
            >
              All Users
            </Component>,
          ),
        )
        .toJSON()
      expect(tree).toMatchSnapshot()
    })

    test('links to Users Page with query param', () => {
      const tree = renderer
        .create(
          render(
            <Component route="users" params={{ nameQuery: 'john' }}>
              All Users
            </Component>,
          ),
        )
        .toJSON()
      expect(tree).toMatchSnapshot()
    })

    test('links to Users Page with optional path param', () => {
      const tree = renderer
        .create(
          render(
            <Component route="users" params={{ role: 'admin' }}>
              All Users
            </Component>,
          ),
        )
        .toJSON()
      expect(tree).toMatchSnapshot()
    })

    test('links to Home Page with activeProps', () => {
      const tree = renderer
        .create(
          render(
            <Component route="home" activeProps={{ active: true }}>
              Home
            </Component>,
          ),
        )
        .toJSON()
      expect(tree).toMatchSnapshot()
    })

    test('does not link to page when no route is matched', () => {
      console.warn = jest.fn()

      const tree = renderer
        .create(render(<Component route="nonsense">Invalid</Component>))
        .toJSON()

      expect(tree).toMatchSnapshot()
      expect(console.warn.mock.calls[0][0]).toBe(messages.NO_MATCH_HREF)
    })

    test('listens and unlistens to history according to whether activeProps are passed', () => {
      const withActiveProps = render(
        <Component route="home" activeProps={{ active: true }}>
          Home
        </Component>,
      )
      const withoutActiveProps = render(
        <Component route="home">Home</Component>,
      )
      const tree1 = renderer.create(render(withActiveProps))
      const tree2 = renderer.create(render(withoutActiveProps))
      const instance1 = getLinkInstance(tree1)
      const instance2 = getLinkInstance(tree2)

      expect(instance1._unlisten).toBeDefined()
      expect(instance2._unlisten).not.toBeDefined()

      tree1.update(render(withoutActiveProps))
      expect(instance1._unlisten).not.toBeDefined()

      tree1.update(render(withActiveProps))
      expect(instance1._unlisten).toBeDefined()

      tree1.unmount()
      expect(instance1._unlisten).not.toBeDefined()

      tree2.unmount()
      expect(instance2._unlisten).not.toBeDefined()
    })

    test('changes the location on left-click when location is different than link', () => {
      const event = { button: 0, preventDefault: jest.fn() }
      const tree = renderer.create(
        render(<Component route="home">Home</Component>),
      )

      history.push('/nonsense')
      const oldKey = history.location.key

      getLinkInstance(tree).onClick(event)
      expect(oldKey).not.toBe(history.location.key)
    })

    test('pushes the location on left-click', () => {
      const event = { button: 0, preventDefault: jest.fn() }
      const tree = renderer.create(
        render(
          <Component route="users" replace={false}>
            Home
          </Component>,
        ),
      )

      history.replace('/')
      const prevLength = history.length

      getLinkInstance(tree).onClick(event)
      expect(history).toHaveLength(prevLength + 1)
    })

    test('replaces the location on left-click', () => {
      const event = { button: 0, preventDefault: jest.fn() }
      const tree = renderer.create(
        render(
          <Component route="users" replace={true}>
            Home
          </Component>,
        ),
      )

      history.replace('/')
      const prevLength = history.length

      getLinkInstance(tree).onClick(event)
      expect(history).toHaveLength(prevLength)
    })

    test('does not change location on left-click when location is same as link', () => {
      const event = { button: 0, preventDefault: jest.fn() }
      const tree = renderer.create(
        render(<Component route="home">Home</Component>),
      )

      history.push('/')
      const oldKey = history.location.key

      getLinkInstance(tree).onClick(event)
      expect(oldKey).toBe(history.location.key)
    })

    test('does not change location on left-click when no route is matched', () => {
      console.warn = jest.fn()

      const event = { button: 0, preventDefault: jest.fn() }
      const tree = renderer.create(
        render(<Component route="nonsense">Invalid</Component>),
      )

      history.push('/')
      const oldKey = history.location.key

      getLinkInstance(tree).onClick(event)
      expect(oldKey).toBe(history.location.key)
      expect(console.warn.mock.calls[0][0]).toBe(messages.NO_MATCH_HREF)
      expect(console.warn.mock.calls[1][0]).toBe(messages.NO_MATCH_CLICK)
    })

    test('calls onClick function on click', () => {
      const onClick = jest.fn()
      const event = { button: 0, preventDefault: jest.fn() }
      const tree = renderer.create(
        render(
          <Component route="home" onClick={onClick}>
            Home
          </Component>,
        ),
      )

      getLinkInstance(tree).onClick(event)
      expect(onClick).toHaveBeenCalled()
    })

    test('prevents default click action on left-click', () => {
      const onClick = jest.fn()
      const event = { button: 0, preventDefault: jest.fn() }
      const tree = renderer.create(
        render(
          <Component route="home" onClick={onClick}>
            Home
          </Component>,
        ),
      )

      getLinkInstance(tree).onClick(event)
      expect(event.preventDefault).toHaveBeenCalled()
    })

    test('does not prevent default click action on non-left-click', () => {
      const onClick = jest.fn()
      const event = { button: 2, preventDefault: jest.fn() }
      const tree = renderer.create(
        render(
          <Component route="home" onClick={onClick}>
            Home
          </Component>,
        ),
      )

      getLinkInstance(tree).onClick(event)
      expect(event.preventDefault).not.toHaveBeenCalled()
    })
  })
}
