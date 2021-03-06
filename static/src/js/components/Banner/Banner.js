import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Button from '../Button/Button'

import './Banner.scss'

export const Banner = ({
  message,
  title,
  type,
  onClose
}) => {
  const bannerClassNames = classNames([
    'banner',
    {
      'banner--error': type === 'error'
    }
  ])
  return (
    <div className={bannerClassNames}>
      <div className="banner__content">
        <h2 className="banner__title">{title}</h2>
        {' '}
        <p className="banner__message">{message}</p>
      </div>
      <Button
        className="banner__close"
        label="close"
        onClick={onClose}
        icon="times-circle"
      />
    </div>
  )
}

Banner.propTypes = {
  message: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ]).isRequired,
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ]).isRequired,
  type: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired
}

export default Banner
