import React from 'react'
import { Link } from 'react-router-dom'
import Button from '../../components/common/Button/Button'
import './NotFound.css'

const NotFound = () => {
  return (
    <div className="not-found">
      <div className="container">
        <div className="not-found-content">
          <h1 className="not-found-title">404</h1>
          <h2 className="not-found-subtitle">Page Not Found</h2>
          <p className="not-found-description">
            The page you are looking for doesn't exist or has been moved.
          </p>
          <Button as={Link} to="/" variant="primary">
            Go Back Home
          </Button>
        </div>
      </div>
    </div>
  )
}

export default NotFound
