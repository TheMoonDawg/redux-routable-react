import { createPath, locationsAreEqual } from 'history'

import PropTypes from 'prop-types'
import React from 'react'
import getLocationFromSpec from './getLocationFromSpec'

const modifiedEvent = event =>
  event.metaKey || event.altKey || event.ctrlKey || event.shiftKey

const filterProps = ({ ...props }) => {
  delete props.route
  delete props.params
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
    if (this.unlisten) {
      this.unlisten()
    }
  }

  listen = () => {
    this.unlisten = this.context.history.listen(this.locationListener)
  }

  locationListener = location => {
    const linkLocation = this.getLocation(this.props, this.context)
    const isActive = this.props.isActive(location, linkLocation)

    this.setState({ isActive })
  }

  getLocation = (props, context) => {
    const spec = { route: props.route, params: props.params }

    return getLocationFromSpec(context.routes, context.history.location, spec)
  }

  getHref = (props, context) => {
    const location = this.getLocation(props, context)

    return context.history.createHref(location)
  }

  shouldPush = event =>
    !event.defaultPrevented && // Default not prevented
    !modifiedEvent(event) && // No modifier
    this.props.target === undefined && // Target not given
    event.button === 0 // Left click

  onClick = event => {
    if (this.props.onClick) {
      this.props.onClick(event)
    }

    if (this.shouldPush(event)) {
      event.preventDefault()

      const oldLocation = this.context.history.location
      const newLocation = this.getLocation(this.props, this.context)
      const path = createPath(newLocation)

      if (!locationsAreEqual(oldLocation, newLocation)) {
        this.context.history.push(path)
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
  params: PropTypes.object.isRequired,
  activeProps: PropTypes.object,
  component: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  target: PropTypes.string,
  isActive: PropTypes.func,
  onClick: PropTypes.func,
}

Link.defaultProps = {
  component: 'a',
  isActive: defaultIsActive,
}

Link.contextTypes = {
  routes: PropTypes.array,
  history: PropTypes.object,
}

export default Link
