import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Styles/Login.css";
import { userAuth } from "../Auth/Hook/useAuth.js"
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

// ── InputField — defined OUTSIDE LoginPage to prevent focus loss on re-render ─
function InputField({
  name,
  label,
  type = "text",
  placeholder,
  icon,
  value,
  onChange,
  showPassword,
  onTogglePassword,
  hasError,
  errorMsg,
}) {
  return (
    <div className="login-input-group">
      <label htmlFor={name} className="login-label">{label}</label>
      <div className="login-input-wrap">
        <span className="login-input-icon">{icon}</span>
        <input
          id={name}
          name={name}
          type={name === "password" ? (showPassword ? "text" : "password") : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={name === "password" ? "current-password" : "email"}
          className={[
            "login-input",
            hasError            ? "has-error"         : "",
            name === "password" ? "has-password-icon" : "",
          ].filter(Boolean).join(" ")}
        />
        {name === "password" && (
          <button
            type="button"
            className="login-eye-btn"
            onClick={onTogglePassword}
            aria-label="Toggle password visibility"
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        )}
      </div>
      {hasError && <p className="login-field-error">⚠ {errorMsg}</p>}
    </div>
  );
}

// ── Main LoginPage component ─────────────────────────────────────────────────
export default function LoginPage() {
  const { HandleLogin } = userAuth();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);

  // ── Form state ────────────────────────────────────────────────────────────
  const [showPassword, setShowPass] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  const [form, setForm] = useState({
    email:    "",
    password: "",
  });

  // ── Cursor tracking state ─────────────────────────────────────────────────
  const [cursorPos, setCursorPos]         = useState({ x: 0, y: 0 });
  const [isHoveringHero, setIsHoveringHero] = useState(false);

  const handleHeroMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCursorPos({
      x: Math.round(e.clientX - rect.left),
      y: Math.round(e.clientY - rect.top),
    });
  };

  // ── Form helpers ──────────────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (fieldErrors[name]) setFieldErrors((p) => ({ ...p, [name]: "" }));
    if (submitError) setSubmitError("");
  };

  const validate = () => {
    const errs = {};
    if (!/^\S+@\S+\.\S+$/.test(form.email))
      errs.email = "Please enter a valid email address.";
    if (form.password.length < 6)
      errs.password = "Password must be at least 6 characters.";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    const errs = validate();
    if (Object.keys(errs).length) { setFieldErrors(errs); return; }

    const result = await HandleLogin({ email: form.email, password: form.password });

    if (result?.success) {
      navigate("/");
    } else {
      setSubmitError(result?.message || "Login failed. Please try again.");
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="login-page">

      {/* ── LEFT: Hero / Brand Panel ──────────────────────────────────────── */}
      <div
        className="login-hero"
        onMouseMove={handleHeroMouseMove}
        onMouseEnter={() => setIsHoveringHero(true)}
        onMouseLeave={() => setIsHoveringHero(false)}
      >
        <div className="login-hero-bg" />
        <div className="login-hero-grid" />
        <div className="login-orb login-orb-1" />
        <div className="login-orb login-orb-2" />

        {isHoveringHero && (
          <div
            className="login-cursor-orb"
            style={{ left: cursorPos.x, top: cursorPos.y }}
          />
        )}

        <div className="login-logo-wrap">
          <div className="login-logo-icon">👗</div>
          <div>
            <span className="login-logo-text">Krishna Fashion</span>
            <span className="login-logo-sub">Premium Clothing</span>
          </div>
        </div>

        <h1 className="login-hero-title">
          Welcome{" "}
          <span className="login-hero-highlight">Back</span>
        </h1>

        <p className="login-hero-subtitle">
          Sign in to continue your fashion journey. Explore curated
          collections, track your orders, and connect with top designers —
          all in one place.
        </p>

        {isHoveringHero && (
          <div className="login-cursor-display">
            <span className="login-cursor-badge">X : {cursorPos.x}</span>
            <span className="login-cursor-badge">Y : {cursorPos.y}</span>
          </div>
        )}

        <div className="login-tags-row">
          {["Luxury", "Streetwear", "Minimalist", "Ethnic", "Athleisure"].map((tag) => (
            <span key={tag} className="login-tag">{tag}</span>
          ))}
        </div>
      </div>

      {/* ── RIGHT: Login Form Panel ───────────────────────────────────────── */}
      <div className="login-form-panel">
        <div className="login-form-container">

          <div className="login-welcome-badge">
            ✨ &nbsp; Welcome Back
          </div>

          <div className="login-form-header">
            <h2 className="login-form-title">Sign In</h2>
            <p className="login-form-subtitle">
              Enter your credentials to access your account.
            </p>
          </div>

          {/* Global error banner */}
          {(submitError || error) && (
            <div className="login-error-banner" role="alert">
              <span>⛔</span>
              <span>{submitError || error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate>

            <InputField
              name="email"
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              icon="✉️"
              value={form.email}
              onChange={handleChange}
              hasError={!!fieldErrors.email}
              errorMsg={fieldErrors.email}
            />

            <InputField
              name="password"
              label="Password"
              placeholder="Your password"
              icon="🔒"
              value={form.password}
              onChange={handleChange}
              showPassword={showPassword}
              onTogglePassword={() => setShowPass((p) => !p)}
              hasError={!!fieldErrors.password}
              errorMsg={fieldErrors.password}
            />

            {/* Forgot password */}
            <div className="login-forgot-row">
              <Link to="/forgot-password" className="login-forgot-link">
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              id="login-submit"
              disabled={loading}
              className="login-submit-btn"
            >
              {loading ? (
                <>
                  <span className="login-spinner" />
                  Signing you in…
                </>
              ) : (
                "Sign In to Krishna Fashion ✨"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="login-divider">
            <div className="login-divider-line" />
            <span className="login-divider-text">New here?</span>
            <div className="login-divider-line" />
          </div>

          {/* Register link */}
          <div className="login-register-link">
            <Link to="/register" className="login-register-anchor">
              Create your free account →
            </Link>
          </div>

          {/* Trust badges */}
          <div className="login-trust-row">
            <div className="login-trust-item">🔒 Secure Login</div>
            <div className="login-trust-item">🛡️ SSL Encrypted</div>
            <div className="login-trust-item">✅ Trusted by 50k+</div>
          </div>

        </div>
      </div>
    </div>
  );
}
