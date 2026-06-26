import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { userAuth } from '../Auth/Hook/useAuth';
import '../Styles/Home.css';

export default function HomePage() {
  const { user, loading } = useSelector((state) => state.auth);
  const { HandleLogout } = userAuth();

  const onLogoutClick = async () => {
    await HandleLogout();
  };

  // Get initials for avatar placeholder
  const getInitials = (name) => {
    if (!name) return 'KF';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Member';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="home-page">
      {/* Background visual elements */}
      <div className="home-bg-gradient" />
      <div className="home-bg-grid" />
      <div className="home-orb home-orb-1" />
      <div className="home-orb home-orb-2" />

      {/* Header / Navbar */}
      <header className="home-header">
        <div className="home-logo">
          <span className="home-logo-icon">👗</span>
          <span className="home-logo-text">Krishna Fashion</span>
        </div>
        <div className="home-nav-links">
          {user ? (
            <button className="home-nav-logout-btn" onClick={onLogoutClick} disabled={loading}>
              {loading ? 'Logging out...' : 'Logout 🔓'}
            </button>
          ) : (
            <>
              <Link to="/login" className="home-nav-link">Sign In</Link>
              <Link to="/register" className="home-nav-btn">Register</Link>
            </>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="home-main">
        {user ? (
          /* ============================================================
             AUTHENTICATED USER DASHBOARD
             ============================================================ */
          <div className="home-dashboard">
            <div className="home-welcome-badge">
              ✨ Welcome Back, {user.fullname.split(' ')[0]}!
            </div>
            
            <div className="home-profile-card">
              <div className="home-profile-avatar-container">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.fullname} className="home-profile-avatar" />
                ) : (
                  <div className="home-profile-avatar-placeholder">
                    {getInitials(user.fullname)}
                  </div>
                )}
                <span className="home-profile-status-dot" />
              </div>

              <h2 className="home-profile-name">{user.fullname}</h2>
              <p className="home-profile-role">{user.role.toUpperCase()}</p>
              
              <div className="home-profile-details">
                <div className="home-detail-row">
                  <span className="home-detail-label">Email Address</span>
                  <span className="home-detail-value">{user.email}</span>
                </div>
                {user.contact && (
                  <div className="home-detail-row">
                    <span className="home-detail-label">Contact Number</span>
                    <span className="home-detail-value">{user.contact}</span>
                  </div>
                )}
                <div className="home-detail-row">
                  <span className="home-detail-label">Joined On</span>
                  <span className="home-detail-value">{formatDate(user.createdAt)}</span>
                </div>
                <div className="home-detail-row">
                  <span className="home-detail-label">Verification Status</span>
                  <span className={`home-detail-value status-${user.isVerified ? 'verified' : 'pending'}`}>
                    {user.isVerified ? '✓ Verified Member' : 'Pending Verification'}
                  </span>
                </div>
              </div>

              <div className="home-profile-actions">
                <button className="home-btn-primary">Explore Collections 👜</button>
                <button className="home-btn-secondary" onClick={onLogoutClick} disabled={loading}>
                  {loading ? 'Logging out...' : 'Logout from Account'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ============================================================
             GUEST / ANONYMOUS WELCOME SCREEN
             ============================================================ */
          <div className="home-welcome">
            <div className="home-welcome-badge">
              ✨ Experience Premium Fashion
            </div>
            <h1 className="home-welcome-title">
              Redefining <br />
              <span className="home-welcome-highlight">Modern Luxury</span>
            </h1>
            <p className="home-welcome-subtitle">
              Discover unique, high-fashion pieces curated just for you. Connect with top designers, 
              track your orders, and express your personal style with absolute luxury.
            </p>

            <div className="home-welcome-actions">
              <Link to="/login" className="home-btn-primary">Sign In to Your Account</Link>
              <Link to="/register" className="home-btn-secondary">Join Krishna Fashion</Link>
            </div>

            {/* Quick stats / trust badges */}
            <div className="home-stats-row">
              <div className="home-stat-item">
                <span className="home-stat-num">50k+</span>
                <span className="home-stat-label">Happy Buyers</span>
              </div>
              <div className="home-stat-item">
                <span className="home-stat-num">500+</span>
                <span className="home-stat-label">Bespoke Brands</span>
              </div>
              <div className="home-stat-item">
                <span className="home-stat-num">24h</span>
                <span className="home-stat-label">Premium Support</span>
              </div>
            </div>

            {/* Category Showcases */}
            <div className="home-categories-section">
              <h3 className="home-categories-title">Shop Our Curated Selections</h3>
              <div className="home-categories-grid">
                <div className="home-category-card">
                  <div className="home-category-icon">👑</div>
                  <h4>Luxury Streetwear</h4>
                  <p>Bold statement garments tailored for high-end streetwear enthusiasts.</p>
                </div>
                <div className="home-category-card">
                  <div className="home-category-icon">✨</div>
                  <h4>Designer Ethnic</h4>
                  <p>Masterful, exquisite traditional garments reflecting rich heritage.</p>
                </div>
                <div className="home-category-card">
                  <div className="home-category-icon">🌿</div>
                  <h4>Minimalist Chic</h4>
                  <p>Clean lines, sustainable fabrics, and elegant silhouettes for everyday.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="home-footer">
        <p>&copy; 2026 Krishna Fashion. All rights reserved.</p>
        <p className="home-footer-sub">Premium Wardrobe Solutions &bull; SSL Secured</p>
      </footer>
    </div>
  );
}
