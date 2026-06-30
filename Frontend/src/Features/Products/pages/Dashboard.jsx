import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useProduct } from '../Hook/useProduct';
import '../Styles/Dashboard.css';

/* ── Helpers ────────────────────────────────────────────── */
const formatPrice = (price) => {
  if (!price) return '—';
  const { amount, currency } = price;
  if (currency === 'INR') return `₹${Number(amount).toLocaleString('en-IN')}`;
  return `${currency} ${Number(amount).toLocaleString()}`;
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
};

/* ── Stats computation ──────────────────────────────────── */
const computeStats = (products) => {
  const total = products.length;
  const totalRev = products.reduce((s, p) => s + (p?.price?.amount || 0), 0);
  const avgPrice = total > 0 ? Math.round(totalRev / total) : 0;
  // Categorise as "active" if price > 0, otherwise "draft"
  const active = products.filter((p) => p?.price?.amount > 0).length;
  return { total, totalRev, avgPrice, active };
};

/* ── Sidebar Links ──────────────────────────────────────── */
const NAV = [
  { icon: '📊', label: 'Dashboard',   active: true },
  { icon: '📦', label: 'Inventory',   active: false },
  { icon: '📈', label: 'Analytics',   active: false },
  { icon: '🛒', label: 'Orders',      active: false },
  { icon: '⚙️', label: 'Settings',    active: false },
];

/* ── Component ─────────────────────────────────────────── */
export const Dashboard = () => {
  const { handleSellerProduct } = useProduct();
  const sellerProducts = useSelector((state) => state.product.sellerProducts);

  const [search, setSearch] = useState('');

  useEffect(() => {
    handleSellerProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Derived data */
  const stats = useMemo(() => computeStats(sellerProducts), [sellerProducts]);

  const filtered = useMemo(() => {
    if (!search.trim()) return sellerProducts;
    const q = search.toLowerCase();
    return sellerProducts.filter(
      (p) =>
        p.title?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q),
    );
  }, [sellerProducts, search]);

  return (
    <div className="db-page">
      {/* Ambient orbs */}
      <div className="db-orb-1" />
      <div className="db-orb-2" />
      <div className="db-orb-3" />

      <div className="db-layout">
        {/* ── Top Nav ─────────────────────────────────────── */}
        <nav className="db-topnav">
          <div className="db-brand">
            <span className="db-brand-icon">🛍️</span>
            <div>
              <h1 className="db-brand-name">Krishna Fashion</h1>
              <span className="db-brand-sub">Seller Dashboard</span>
            </div>
          </div>

          <div className="db-nav-right">
            <div className="db-welcome-block">
              <p>Welcome back!</p>
              <span>Seller Account</span>
            </div>
            <div className="db-avatar" title="Profile">👤</div>
          </div>
        </nav>

        <div className="db-body">
          {/* ── Sidebar ─────────────────────────────────── */}
          <aside className="db-sidebar">
            {NAV.map(({ icon, label, active }) => (
              <div
                key={label}
                className={`db-sidebar-link${active ? ' active' : ''}`}
              >
                <span className="db-nav-icon">{icon}</span>
                {label}
              </div>
            ))}
          </aside>

          {/* ── Main ────────────────────────────────────── */}
          <main className="db-main">

            {/* ── Stats Row ──────────────────────────────── */}
            <section className="db-stats-grid">

              {/* Total Products */}
              <div className="db-glass-card db-stat-card">
                <div
                  className="db-stat-orb"
                  style={{ background: 'rgba(212,175,55,0.12)' }}
                />
                <div className="db-stat-header">
                  <p className="db-stat-label">Total Products</p>
                  <div className="db-stat-icon">📦</div>
                </div>
                <div className="db-stat-body">
                  <p className="db-stat-value">{stats.total}</p>
                  <p className="db-stat-sub">Listed by you</p>
                </div>
              </div>

              {/* Total Revenue (sum of prices) */}
              <div className="db-glass-card db-stat-card">
                <div
                  className="db-stat-orb"
                  style={{ background: 'rgba(212,175,55,0.1)' }}
                />
                <div className="db-stat-header">
                  <p className="db-stat-label">Inventory Value</p>
                  <div className="db-stat-icon">💰</div>
                </div>
                <div className="db-stat-body">
                  <p className="db-stat-value gold">
                    ₹{Number(stats.totalRev).toLocaleString('en-IN')}
                  </p>
                  <p className="db-stat-sub">Combined listing value</p>
                </div>
              </div>

              {/* Active Listings */}
              <div className="db-glass-card db-stat-card">
                <div
                  className="db-stat-orb"
                  style={{ background: 'rgba(212,175,55,0.08)' }}
                />
                <div className="db-stat-header">
                  <p className="db-stat-label">Active Listings</p>
                  <div className="db-stat-icon">✅</div>
                </div>
                <div className="db-stat-body">
                  <p className="db-stat-value">{stats.active}</p>
                  <p className="db-stat-sub">Priced products</p>
                </div>
              </div>

              {/* Average Price */}
              <div className="db-glass-card db-stat-card">
                <div
                  className="db-stat-orb"
                  style={{ background: 'rgba(212,175,55,0.09)' }}
                />
                <div className="db-stat-header">
                  <p className="db-stat-label">Avg. Price</p>
                  <div className="db-stat-icon">🏷️</div>
                </div>
                <div className="db-stat-body">
                  <p className="db-stat-value gold">
                    ₹{Number(stats.avgPrice).toLocaleString('en-IN')}
                  </p>
                  <p className="db-stat-sub">Per product</p>
                </div>
              </div>

            </section>

            {/* ── Products Section ───────────────────────── */}
            <section className="db-products-section">

              {/* Section Header */}
              <div className="db-section-header">
                <h2 className="db-section-title">
                  My Listed Products
                  {sellerProducts.length > 0 && (
                    <span>{sellerProducts.length} items</span>
                  )}
                </h2>

                <div className="db-section-controls">
                  {/* Search */}
                  <div className="db-search-wrap">
                    <span className="db-search-icon">🔍</span>
                    <input
                      type="text"
                      className="db-search-input"
                      placeholder="Search products…"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>

                  {/* Add New Product */}
                  <Link to="/seller/create-product" className="db-add-btn">
                    ＋ Add New Product
                  </Link>
                </div>
              </div>

              {/* Product Grid */}
              <div className="db-product-grid">
                {filtered.length === 0 ? (
                  /* Empty State */
                  <div className="db-empty">
                    <div className="db-empty-icon">🛍️</div>
                    <h3>
                      {search
                        ? 'No products match your search'
                        : 'No products listed yet'}
                    </h3>
                    <p>
                      {search
                        ? 'Try a different keyword or clear the search.'
                        : 'Start selling by adding your first product!'}
                    </p>
                    {!search && (
                      <Link to="/seller/create-product" className="db-empty-cta">
                        ＋ List Your First Product
                      </Link>
                    )}
                  </div>
                ) : (
                  filtered.map((product, i) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      index={i}
                    />
                  ))
                )}
              </div>

            </section>

            {/* ── Footer ─────────────────────────────────── */}
            <footer className="db-footer">
              <p>© 2024 Krishna Fashion. All rights reserved.</p>
              <div className="db-footer-links">
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Service</a>
                <a href="#">Help Center</a>
              </div>
            </footer>

          </main>
        </div>
      </div>
    </div>
  );
};

/* ── Product Card ───────────────────────────────────────── */
const ProductCard = ({ product, index }) => {
  const {
    title,
    description,
    category,
    price,
    images,
    createdAt,
  } = product;

  const imgSrc = images?.[0]?.url || null;

  return (
    <div
      className="db-glass-card db-product-card"
      style={{ animationDelay: `${index * 0.06}s` }}
    >
      {/* Image */}
      <div className="db-product-img-wrap">
        {imgSrc ? (
          <>
            <img src={imgSrc} alt={title} loading="lazy" />
            <div className="db-img-overlay" />
          </>
        ) : (
          <div className="db-img-placeholder">
            <span>🖼️</span>
            <p>No image</p>
          </div>
        )}

        {/* Category badge */}
        {category && (
          <span className="db-badge">{category}</span>
        )}
      </div>

      {/* Info */}
      <div className="db-product-info">
        <div>
          <h3 className="db-product-title" title={title}>{title}</h3>
          <p className="db-product-desc">{description || 'No description provided.'}</p>
        </div>

        <div className="db-product-footer">
          <span className="db-product-price">{formatPrice(price)}</span>

          <div className="db-product-actions">
            <button
              className="db-icon-btn edit"
              title="Edit product"
              aria-label="Edit product"
            >
              ✏️
            </button>
            <button
              className="db-icon-btn delete"
              title="Delete product"
              aria-label="Delete product"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
