import React from 'react'
import './ContinueWithgoogle.css'

const ContinueWithgoogle = () => {
  return (
    <div className="google-btn-container">
      <a href="/api/auth/google" className="google-btn" aria-label="Continue with Google">
        <span className="google-icon" aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 533.5 544.3" width="18" height="18">
            <path fill="#4285F4" d="M533.5 278.4c0-17.4-1.6-34.1-4.6-50.4H272v95.5h146.9c-6.4 34.6-25.8 63.9-55 83.4v69.2h88.9c52-48 82.7-118.3 82.7-197.7z"/>
            <path fill="#34A853" d="M272 544.3c74 0 136-24.6 181.3-66.9l-88.9-69.2c-24.7 16.6-56.4 26.4-92.4 26.4-71 0-131.2-48-152.8-112.4H28.5v70.7C73.8 481.6 166.5 544.3 272 544.3z"/>
            <path fill="#FBBC05" d="M119.2 327.1c-10.7-31.8-10.7-66.2 0-98l-91-70.7C6.1 200 0 238 0 272s6.1 72 28.2 113.6l91-58.5z"/>
            <path fill="#EA4335" d="M272 107.6c39.9 0 75.6 13.7 103.8 40.5l77.7-77.7C407.8 24.1 344.7 0 272 0 166.5 0 73.8 62.7 28.5 156.4l91 70.7C140.8 155.6 201 107.6 272 107.6z"/>
          </svg>
        </span>
        <span className="google-text">Continue with Google</span>
      </a>
    </div>
  )
}

export default ContinueWithgoogle