import React from 'react'
import './Button.css'

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  as: Component = 'button',
  ...props
}) => {
  const classNames = `btn btn--${variant} btn--${size} ${className}`

  if (Component === 'button') {
    return (
      <button
        type={type}
        className={classNames}
        disabled={disabled}
        onClick={onClick}
        {...props}
      >
        {children}
      </button>
    )
  }

  return (
    <Component className={classNames} onClick={onClick} {...props}>
      {children}
    </Component>
  )
}

export default Button
