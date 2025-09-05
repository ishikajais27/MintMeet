import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import Button from '../Button/Button'
import './Header.css'

const Header = () => {
  const location = useLocation()

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="header-logo">
            EventProof
          </Link>
          <nav className="header-nav">
            <Link
              to="/"
              className={`header-nav__link ${
                location.pathname === '/' ? 'header-nav__link--active' : ''
              }`}
            >
              Home
            </Link>
            <Link
              to="/dashboard"
              className={`header-nav__link ${
                location.pathname === '/dashboard'
                  ? 'header-nav__link--active'
                  : ''
              }`}
            >
              Dashboard
            </Link>
          </nav>
          <div className="header-actions">
            <Button as={Link} to="/create-event" variant="primary" size="small">
              Create Event
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
