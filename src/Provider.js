import PropTypes from 'prop-types'
import React from 'react'

class Provider extends React.Component {
  getChildContext = () => ({
    routes: this.props.routes,
    history: this.props.history,
  })

  render = () => this.props.children
}

Provider.propTypes = {
  routes: PropTypes.array.isRequired,
  history: PropTypes.object.isRequired,
  children: PropTypes.node,
}

Provider.childContextTypes = {
  routes: PropTypes.array,
  history: PropTypes.object,
}

export default Provider
