import * as messages from './messages'

import {
  createSpec,
  getLocationFromSpec,
  getRoute,
  locationsEqual,
} from 'redux-routable'

import PropTypes from 'prop-types'
import React from 'react'

const modifiedEvent = event =>
  event.metaKey || event.altKey || event.ctrlKey || event.shiftKey

const filterProps = ({ ...props }) => {
  delete props.route
  delete props.params
  delete props.replace
  delete props.activeProps
  delete props.component
  delete props.isActive

  return props
}

const defaultIsActive = (oldLocation, newLocation) =>
  oldLocation.pathname === newLocation.pathname

class Link extends React.Component {
  state = {
    isActive: false,
  }

  componentWillMount = () => {
    if ('activeProps' in this.props) {
      this.locationListener(this.context.history.location)
      this.listen()
    }
  }

  componentWillReceiveProps = nextProps => {
    const hadActiveProps = 'activeProps' in this.props
    const hasActiveProps = 'activeProps' in nextProps

    if (!hadActiveProps && hasActiveProps) {
      this.listen()
    }

    if (hadActiveProps && !hasActiveProps) {
      this.unlisten()
    }
  }

  componentWillUnmount = () => {
    if (this._unlisten) {
      this.unlisten()
    }
  }

  listen = () => {
    this._unlisten = this.context.history.listen(this.locationListener)
  }

  unlisten = () => {
    this._unlisten()
    delete this._unlisten
  }

  locationListener = location => {
    const linkLocation = this.getLocation(this.props, this.context)
    const isActive = this.props.isActive(location, linkLocation)

    this.setState({ isActive })
  }

  getLocation = (props, context) => {
    const route = getRoute(context.routes, props.route)

    if (route !== undefined) {
      const spec = createSpec(route, props.params)

      return getLocationFromSpec(context.routes, context.history.location, spec)
    } else {
      return undefined
    }
  }

  getHref = (props, context) => {
    const location = this.getLocation(props, context)

    if (location !== undefined) {
      return context.history.createHref(location)
    } else {
      console.warn(messages.NO_MATCH_HREF)

      return undefined
    }
  }

  shouldChangeLocation = event =>
    !event.defaultPrevented && // Default not prevented
    !modifiedEvent(event) && // No modifier
    this.props.target === undefined && // Target not given
    event.button === 0 // Left click

  onClick = event => {
    if (this.props.onClick) {
      this.props.onClick(event)
    }

    if (this.shouldChangeLocation(event)) {
      event.preventDefault()

      const oldLocation = this.context.history.location
      const newLocation = this.getLocation(this.props, this.context)

      if (newLocation !== undefined) {
        if (!locationsEqual(oldLocation, newLocation)) {
          if (this.props.replace) {
            this.context.history.replace(newLocation)
          } else {
            this.context.history.push(newLocation)
          }
        }
      } else {
        console.warn(messages.NO_MATCH_CLICK)
      }
    }
  }

  render = () => {
    const filteredProps = filterProps(this.props)
    const activeProps = this.state.isActive ? this.props.activeProps : {}
    const Component = this.props.component
    const href = this.getHref(this.props, this.context)

    return (
      <Component
        {...filteredProps}
        {...activeProps}
        href={href}
        onClick={this.onClick}
      />
    )
  }
}

Link.propTypes = {
  children: PropTypes.node,
  route: PropTypes.string.isRequired,
  params: PropTypes.object,
  replace: PropTypes.bool,
  activeProps: PropTypes.object,
  component: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  target: PropTypes.string,
  isActive: PropTypes.func,
  onClick: PropTypes.func,
}

Link.defaultProps = {
  params: {},
  replace: false,
  component: 'a',
  isActive: defaultIsActive,
}

Link.contextTypes = {
  routes: PropTypes.array,
  history: PropTypes.object,
}

export default Link
