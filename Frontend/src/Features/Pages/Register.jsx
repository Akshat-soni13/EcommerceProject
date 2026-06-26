import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { userAuth } from "../Auth/Hook/useAuth";
import { useSelector } from "react-redux";
import "../Styles/Register.css";
import KrishnaLoader from "../Styles/Loader"
import ContinueWithgoogle from "../components/ContinueWithgoogle";


// ── Password strength helper ─────────────────────────────────────────────────
function getStrength(password) {
  let score = 0;
  if (!password) return { score: 0, label: "", color: "" };
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const levels = [
    { label: "Too weak", color: "#ff4444" },
    { label: "Weak",     color: "#ff7744" },
    { label: "Fair",     color: "#ffbb33" },
    { label: "Good",     color: "#88cc44" },
    { label: "Strong",   color: "#44cc88" },
  ];
  return { score, ...levels[Math.min(score, 4)] };
}

// ── InputField — defined OUTSIDE RegisterPage so React never remounts it ─────
// If defined inside the parent, every parent re-render (e.g. each keystroke)
// creates a new component identity → React unmounts + remounts the input →
// cursor/focus is lost. Moving it outside fixes this completely.
function InputField({
  name,
  label,
  type = "text",
  placeholder,
  icon,
  extra,
  value,
  onChange,
  onFocus,
  onBlur,
  showPassword,
  onTogglePassword,
  hasError,
  errorMsg,
}) {
  return (
    <div className="reg-input-group">
      <label htmlFor={name} className="reg-label">{label}</label>
      <div className="reg-input-wrap">
        <span className="reg-input-icon">{icon}</span>
        <input
          id={name}
          name={name}
          type={name === "password" ? (showPassword ? "text" : "password") : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={name === "password" ? "new-password" : "off"}
          onFocus={onFocus}
          onBlur={onBlur}
          className={[
            "reg-input",
            hasError            ? "has-error"         : "",
            name === "password" ? "has-password-icon" : "",
          ].filter(Boolean).join(" ")}
        />
        {name === "password" && (
          <button
            type="button"
            className="reg-eye-btn"
            onClick={onTogglePassword}
            aria-label="Toggle password visibility"
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        )}
      </div>
      {hasError && <p className="reg-field-error">⚠ {errorMsg}</p>}
      {extra}
    </div>
  );
}

// ── Main RegisterPage component ──────────────────────────────────────────────
export default function RegisterPage() {
  const navigate = useNavigate();
  const { HandleRegister } = userAuth();
  const { loading, error } = useSelector((s) => s.auth);

  // ── Show the Krishna Loader storyline first, then reveal the form ─────────
  const [showLoader, setShowLoader] = useState(true);

  // ── Form state ────────────────────────────────────────────────────────────
  const [isSeller, setIsSeller]       = useState(false);
  const [showPassword, setShowPass]   = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [focused, setFocused]         = useState({});
  const [fieldErrors, setFieldErrors] = useState({});

  const [form, setForm] = useState({
    fullname: "",
    email:    "",
    contact:  "",
    password: "",
  });

  // ── Cursor tracking state (reusable later) ────────────────────────────────
  const [cursorPos, setCursorPos]       = useState({ x: 0, y: 0 });
  const [isHoveringHero, setIsHoveringHero] = useState(false);

  // ── Handlers: cursor tracking ─────────────────────────────────────────────
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

  const handleFocus = (name) => setFocused((p) => ({ ...p, [name]: true }));
  const handleBlur  = (name) => setFocused((p) => ({ ...p, [name]: false }));

  const validate = () => {
    const errs = {};
    if (!form.fullname.trim() || form.fullname.trim().length < 3)
      errs.fullname = "Full name must be at least 3 characters.";
    if (!/^\S+@\S+\.\S+$/.test(form.email))
      errs.email = "Please enter a valid email address.";
    if (!/^\d{10}$/.test(form.contact))
      errs.contact = "Contact must be exactly 10 digits.";
    if (form.password.length < 6)
      errs.password = "Password must be at least 6 characters.";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    const errs = validate();
    if (Object.keys(errs).length) { setFieldErrors(errs); return; }
    const result = await HandleRegister({ ...form, isSeller });
    if (result?.success) {
      navigate("/");
    } else {
      setSubmitError(result?.message || "Registration failed. Please try again.");
    }
  };

  const strength = getStrength(form.password);

  // ── Show loader first ─────────────────────────────────────────────────────
  if (showLoader) {
    return (
      <KrishnaLoader
        duration={5200}
        onComplete={() => setShowLoader(false)}
      />
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="reg-page">

      {/* ── LEFT: Hero / Brand Panel ──────────────────────────────────────── */}
      <div
        className="reg-hero"
        onMouseMove={handleHeroMouseMove}
        onMouseEnter={() => setIsHoveringHero(true)}
        onMouseLeave={() => setIsHoveringHero(false)}
      >
        <div className="reg-hero-bg" />
        <div className="reg-hero-grid" />
        <div className="reg-orb reg-orb-1" />
        <div className="reg-orb reg-orb-2" />

        {isHoveringHero && (
          <div
            className="reg-cursor-orb"
            style={{ left: cursorPos.x, top: cursorPos.y }}
          />
        )}

        <div className="reg-logo-wrap">
          <div className="reg-logo-icon">👗</div>
          <div>
            <span className="reg-logo-text">Krishna Fashion</span>
            <span className="reg-logo-sub">Premium Clothing</span>
          </div>
        </div>

        <h1 className="reg-hero-title">
          Where Style Meets{" "}
          <span className="reg-hero-highlight">Excellence</span>
        </h1>

        <p className="reg-hero-subtitle">
          Join fashion lovers &amp; sellers across India. Discover curated
          clothing from top brands and independent designers — all in one place.
        </p>

        {isHoveringHero && (
          <div className="reg-cursor-display">
            <span className="reg-cursor-badge">X : {cursorPos.x}</span>
            <span className="reg-cursor-badge">Y : {cursorPos.y}</span>
          </div>
        )}

        <div className="reg-tags-row">
          {["Luxury", "Streetwear", "Minimalist", "Ethnic", "Athleisure"].map((tag) => (
            <span key={tag} className="reg-tag">{tag}</span>
          ))}
        </div>
      </div>

      {/* ── RIGHT: Registration Form Panel ───────────────────────────────── */}
      <div className="reg-form-panel">
        <div className="reg-form-container">

          <div className="reg-form-header">
            <h2 className="reg-form-title">Create Account</h2>
            <p className="reg-form-subtitle">
              Start your fashion journey today — it&apos;s free.
            </p>
          </div>

          {/* Buyer / Seller toggle */}
          <div className="reg-role-toggle" role="group" aria-label="Account type">
            <button
              type="button"
              id="role-buyer"
              className={`reg-role-btn ${!isSeller ? "active" : ""}`}
              onClick={() => setIsSeller(false)}
            >
              🛍️ &nbsp; Shop as Buyer
            </button>
            <button
              type="button"
              id="role-seller"
              className={`reg-role-btn ${isSeller ? "active" : ""}`}
              onClick={() => setIsSeller(true)}
            >
              🏪 &nbsp; Sell on Krishna Fashion
            </button>
          </div>

          {/* Global error banner */}
          {(submitError || error) && (
            <div className="reg-error-banner" role="alert">
              <span>⛔</span>
              <span>{submitError || error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate>

            <InputField
              name="fullname"
              label="Full Name"
              placeholder="e.g. Rahul Sharma"
              icon="👤"
              value={form.fullname}
              onChange={handleChange}
              onFocus={() => handleFocus("fullname")}
              onBlur={() => handleBlur("fullname")}
              hasError={!!fieldErrors.fullname}
              errorMsg={fieldErrors.fullname}
            />

            <InputField
              name="email"
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              icon="✉️"
              value={form.email}
              onChange={handleChange}
              onFocus={() => handleFocus("email")}
              onBlur={() => handleBlur("email")}
              hasError={!!fieldErrors.email}
              errorMsg={fieldErrors.email}
            />

            <InputField
              name="contact"
              label="Phone Number"
              type="tel"
              placeholder="10-digit mobile number"
              icon="📱"
              value={form.contact}
              onChange={handleChange}
              onFocus={() => handleFocus("contact")}
              onBlur={() => handleBlur("contact")}
              hasError={!!fieldErrors.contact}
              errorMsg={fieldErrors.contact}
            />

            <InputField
              name="password"
              label="Password"
              placeholder="Min. 6 characters"
              icon="🔒"
              value={form.password}
              onChange={handleChange}
              onFocus={() => handleFocus("password")}
              onBlur={() => handleBlur("password")}
              showPassword={showPassword}
              onTogglePassword={() => setShowPass((p) => !p)}
              hasError={!!fieldErrors.password}
              errorMsg={fieldErrors.password}
              extra={
                form.password && (
                  <div className="reg-strength-wrap">
                    <div className="reg-strength-bars">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className={`reg-strength-bar ${i <= strength.score ? "filled" : ""}`}
                          style={{ background: i <= strength.score ? strength.color : undefined }}
                        />
                      ))}
                    </div>
                    <span className="reg-strength-label" style={{ color: strength.color }}>
                      {strength.label}
                    </span>
                  </div>
                )
              }
            />

             
            {/* Submit */}
            <button
              type="submit"
              id="register-submit"
              disabled={loading}
              className="reg-submit-btn"
            >
              {loading ? (
                <>
                  <span className="reg-spinner" />
                  Creating your account…
                </>
              ) : (
                isSeller ? "Launch My Shop 🚀" : "Join Krishna Fashion ✨"
              )}
            </button>
          </form>

            {/* Gool=gle */}
            <ContinueWithgoogle></ContinueWithgoogle>
          {/* Divider */}
          <div className="reg-divider">
            <div className="reg-divider-line" />
            <span className="reg-divider-text">Already a member?</span>
            <div className="reg-divider-line" />
          </div>

          {/* Login link */}
          <div className="reg-login-link">
            <Link to="/login" className="reg-login-anchor">
              Sign in to your account →
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
