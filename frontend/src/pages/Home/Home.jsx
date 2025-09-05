import React from 'react'
import { Link } from 'react-router-dom'
import Button from '../../components/common/Button/Button'
import './Home.css'

const Home = () => {
  return (
    <div className="home">
      <section className="home-hero">
        <div className="container">
          <div className="home-hero__content">
            <h1 className="home-hero__title">
              Turn Your Events Into Digital Experiences
            </h1>
            <p className="home-hero__description">
              EventProof makes it easy to create digital attendance badges for
              your events. No technical knowledge required - just create,
              invite, and reward!
            </p>
            <div className="home-hero__actions">
              <Button as={Link} to="/create-event" size="large">
                Get Started
              </Button>
              <Button as={Link} to="/dashboard" variant="outline" size="large">
                View My Events
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="home-features">
        <div className="container">
          <h2 className="home-features__title">How It Works</h2>
          <div className="home-features__grid">
            <div className="feature-card">
              <div className="feature-card__number">1</div>
              <h3 className="feature-card__title">Create Your Event</h3>
              <p className="feature-card__description">
                Add your event details and upload an image. We'll handle the
                rest.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-card__number">2</div>
              <h3 className="feature-card__title">Invite Attendees</h3>
              <p className="feature-card__description">
                Upload a CSV or share a link for people to register themselves.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-card__number">3</div>
              <h3 className="feature-card__title">Send Digital Badges</h3>
              <p className="feature-card__description">
                With one click, mint and send unique NFT badges to all
                attendees.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
