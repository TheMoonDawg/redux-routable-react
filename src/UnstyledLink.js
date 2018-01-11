import Link from './Link'
import PropTypes from 'prop-types'
import React from 'react'

const linkStyle = {
  color: 'initial',
  cursor: 'initial',
  textDecoration: 'initial',
}

const UnstyledAnchor = ({ style, ...props }) => (
  <a {...props} style={{ ...linkStyle, ...style }} />
)

UnstyledAnchor.propTypes = {
  style: PropTypes.object,
}

const UnstyledLink = props => <Link {...props} component={UnstyledAnchor} />

export default UnstyledLink
