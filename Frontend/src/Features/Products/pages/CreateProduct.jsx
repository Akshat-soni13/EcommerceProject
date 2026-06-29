import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProduct } from '../Hook/useProduct';
import '../Styles/CreateProduct.css';

// ── Constants ────────────────────────────────────────────────
const CURRENCIES = ['INR', 'USD', 'EUR', 'GBP', 'JPY'];
const CATEGORIES = [
  'Men\'s Clothing',
  'Women\'s Clothing',
  'Kids\' Clothing',
  'Ethnic Wear',
  'Western Wear',
  'Accessories',
  'Footwear',
  'Sportswear',
  'Winter Wear',
  'Other',
];
const MAX_IMAGES = 5;
const MAX_FILE_SIZE_MB = 5;

// ── Helpers ──────────────────────────────────────────────────
function validateForm(form, images) {
  const errs = {};
  if (!form.title.trim() || form.title.trim().length < 3)
    errs.title = 'Title must be at least 3 characters.';
  if (!form.description.trim() || form.description.trim().length < 10)
    errs.description = 'Description must be at least 10 characters.';
  const price = parseFloat(form.priceAmount);
  if (!form.priceAmount || isNaN(price) || price <= 0)
    errs.priceAmount = 'Enter a valid price greater than 0.';
  if (!form.priceCurrency)
    errs.priceCurrency = 'Please select a currency.';
  if (!form.category)
    errs.category = 'Please select a category.';
  if (images.length === 0)
    errs.images = 'Upload at least one product image.';
  return errs;
}

// ── Component ────────────────────────────────────────────────
const CreateProduct = () => {
  const navigate = useNavigate();
  const { HandleCreateProduct } = useProduct();

  // Form state
  const [form, setForm] = useState({
    title: '',
    description: '',
    priceAmount: '',
    priceCurrency: 'INR',
    category: '',
  });

  // Images state
  const [images, setImages]           = useState([]); // { file, preview }[]
  const [dragging, setDragging]       = useState(false);

  // UI state
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading]         = useState(false);
  const [toast, setToast]             = useState(null); // { hiding }

  const fileInputRef = useRef(null);

  // ── Form change handler ───────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (fieldErrors[name]) setFieldErrors((p) => ({ ...p, [name]: '' }));
    if (submitError) setSubmitError('');
  };

  // ── Image processing ──────────────────────────────────────
  const addFiles = useCallback((files) => {
    const valid = Array.from(files).filter((f) => {
      if (!f.type.startsWith('image/')) return false;
      if (f.size > MAX_FILE_SIZE_MB * 1024 * 1024) return false;
      return true;
    });

    setImages((prev) => {
      const remaining = MAX_IMAGES - prev.length;
      const toAdd = valid.slice(0, remaining).map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));
      return [...prev, ...toAdd];
    });
    if (fieldErrors.images) setFieldErrors((p) => ({ ...p, images: '' }));
  }, [fieldErrors.images]);

  const handleFileInput = (e) => addFiles(e.target.files);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const handleDragLeave = ()  => setDragging(false);

  const removeImage = (idx) => {
    setImages((prev) => {
      URL.revokeObjectURL(prev[idx].preview);
      return prev.filter((_, i) => i !== idx);
    });
  };

  // ── Toast helper ──────────────────────────────────────────
  const showToast = () => {
    setToast({ hiding: false });
    setTimeout(() => setToast({ hiding: true }), 3200);
    setTimeout(() => setToast(null), 3600);
  };

  // ── Submit ────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    const errs = validateForm(form, images);
    if (Object.keys(errs).length) {
      setFieldErrors(errs);
      // Scroll to first error
      const firstErrEl = document.querySelector('.cp-input.has-error, .cp-textarea.has-error, .cp-select.has-error, .cp-drop-zone.has-error');
      if (firstErrEl) firstErrEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setLoading(true);
    try {
      // Build FormData for multipart/form-data (multer on backend)
      const formData = new FormData();
      formData.append('title', form.title.trim());
      formData.append('description', form.description.trim());
      formData.append('priceAmount', form.priceAmount);
      formData.append('priceCurrency', form.priceCurrency);
      formData.append('category', form.category);
      images.forEach(({ file }) => formData.append('images', file));

      const product = await HandleCreateProduct(formData);

      if (product) {
        showToast();
        // Reset form
        setForm({ title: '', description: '', priceAmount: '', priceCurrency: 'INR', category: '' });
        setImages([]);
        setFieldErrors({});
        setTimeout(() => navigate('/'), 3800);
      } else {
        setSubmitError('Product creation failed. Please try again.');
      }
    } catch (err) {
      const msg = err?.response?.data?.message
        || err?.response?.data?.errors?.[0]?.msg
        || 'Something went wrong. Please try again.';
      setSubmitError(msg);
    } finally {
      setLoading(false);
    }
  };

  // ── Render ────────────────────────────────────────────────
  return (
    <div className="cp-page">
      {/* Ambient background orbs */}
      <div className="cp-bg-orb-1" />
      <div className="cp-bg-orb-2" />

      {/* ── Page Header ──────────────────────────────────── */}
      <header className="cp-header">
        <div className="cp-header-icon">🛍️</div>
        <div className="cp-header-text">
          <h1>List a New Product</h1>
          <p>Krishna Fashion · Seller Dashboard</p>
        </div>
      </header>

      {/* ── Card ─────────────────────────────────────────── */}
      <div className="cp-card">
        <form className="cp-form" onSubmit={handleSubmit} noValidate>

          {/* ── SECTION: Basic Info ──────────────────────── */}
          <p className="cp-section-label">Basic Information</p>

          {/* Title */}
          <div className="cp-input-group">
            <label className="cp-label" htmlFor="title">Product Title</label>
            <div className="cp-input-wrap">
              <span className="cp-input-icon">✏️</span>
              <input
                id="title"
                name="title"
                type="text"
                className={`cp-input${fieldErrors.title ? ' has-error' : ''}`}
                placeholder="e.g. Premium Silk Saree - Royal Blue"
                value={form.title}
                onChange={handleChange}
                maxLength={120}
                autoComplete="off"
              />
            </div>
            {fieldErrors.title && <p className="cp-field-error">⚠ {fieldErrors.title}</p>}
          </div>

          {/* Description */}
          <div className="cp-input-group">
            <label className="cp-label" htmlFor="description">Description</label>
            <div className="cp-input-wrap">
              <span className="cp-input-icon" style={{ top: 14, alignSelf: 'flex-start', position: 'absolute' }}>📝</span>
              <textarea
                id="description"
                name="description"
                className={`cp-textarea${fieldErrors.description ? ' has-error' : ''}`}
                placeholder="Describe the product — material, size guide, care instructions…"
                value={form.description}
                onChange={handleChange}
                maxLength={1000}
              />
            </div>
            <span className="cp-char-counter">{form.description.length} / 1000</span>
            {fieldErrors.description && <p className="cp-field-error">⚠ {fieldErrors.description}</p>}
          </div>

          {/* ── SECTION: Pricing ─────────────────────────── */}
          <p className="cp-section-label">Pricing</p>

          <div className="cp-row">
            {/* Price Amount */}
            <div className="cp-input-group">
              <label className="cp-label" htmlFor="priceAmount">Price</label>
              <div className="cp-input-wrap">
                <span className="cp-input-icon">💰</span>
                <input
                  id="priceAmount"
                  name="priceAmount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  className={`cp-input${fieldErrors.priceAmount ? ' has-error' : ''}`}
                  placeholder="0.00"
                  value={form.priceAmount}
                  onChange={handleChange}
                />
              </div>
              {fieldErrors.priceAmount && <p className="cp-field-error">⚠ {fieldErrors.priceAmount}</p>}
            </div>

            {/* Currency */}
            <div className="cp-input-group">
              <label className="cp-label" htmlFor="priceCurrency">Currency</label>
              <div className="cp-input-wrap">
                <span className="cp-input-icon">🌐</span>
                <select
                  id="priceCurrency"
                  name="priceCurrency"
                  className={`cp-select${fieldErrors.priceCurrency ? ' has-error' : ''}`}
                  value={form.priceCurrency}
                  onChange={handleChange}
                >
                  {CURRENCIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              {fieldErrors.priceCurrency && <p className="cp-field-error">⚠ {fieldErrors.priceCurrency}</p>}
            </div>
          </div>

          {/* ── SECTION: Category ────────────────────────── */}
          <p className="cp-section-label">Category</p>

          <div className="cp-input-group">
            <label className="cp-label" htmlFor="category">Product Category</label>
            <div className="cp-input-wrap">
              <span className="cp-input-icon">🏷️</span>
              <select
                id="category"
                name="category"
                className={`cp-select${fieldErrors.category ? ' has-error' : ''}`}
                value={form.category}
                onChange={handleChange}
              >
                <option value="" disabled>Select a category…</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            {fieldErrors.category && <p className="cp-field-error">⚠ {fieldErrors.category}</p>}
          </div>

          {/* ── SECTION: Images ──────────────────────────── */}
          <p className="cp-section-label">Product Images</p>

          {/* Drop zone */}
          <div
            className={`cp-drop-zone${dragging ? ' dragging' : ''}${fieldErrors.images ? ' has-error' : ''}`}
            onClick={() => images.length < MAX_IMAGES && fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            role="button"
            tabIndex={0}
            aria-label="Upload product images"
            onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileInput}
            />
            <span className="cp-drop-icon">{dragging ? '📂' : '🖼️'}</span>
            <p className="cp-drop-title">
              {images.length >= MAX_IMAGES
                ? 'Maximum images reached'
                : dragging
                  ? 'Drop images here…'
                  : 'Drag & drop images, or click to browse'}
            </p>
            <p className="cp-drop-sub">
              Up to <span>{MAX_IMAGES} images</span> · Max <span>{MAX_FILE_SIZE_MB} MB</span> each · JPG, PNG, WEBP
            </p>
          </div>
          {fieldErrors.images && <p className="cp-field-error">⚠ {fieldErrors.images}</p>}

          {/* Image previews */}
          {images.length > 0 && (
            <div className="cp-previews">
              {images.map(({ preview }, idx) => (
                <div key={preview} className="cp-preview-item">
                  <img src={preview} alt={`Preview ${idx + 1}`} />
                  <button
                    type="button"
                    className="cp-preview-remove"
                    onClick={() => removeImage(idx)}
                    aria-label={`Remove image ${idx + 1}`}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* ── Global Error ──────────────────────────────── */}
          {submitError && (
            <div className="cp-error-banner" role="alert">
              <span>🚨</span>
              <span>{submitError}</span>
            </div>
          )}

          {/* ── Submit ───────────────────────────────────── */}
          <button
            id="cp-submit"
            type="submit"
            className="cp-submit-btn"
            disabled={loading}
          >
            <span className="cp-btn-content">
              {loading ? (
                <>
                  <span className="cp-spinner" />
                  Creating Product…
                </>
              ) : (
                <>✨ Create Product</>
              )}
            </span>
          </button>

        </form>
      </div>

      {/* ── Success Toast ─────────────────────────────────── */}
      {toast && (
        <div className={`cp-toast${toast.hiding ? ' hiding' : ''}`} role="status">
          <span className="cp-toast-icon">🎉</span>
          <div className="cp-toast-text">
            <strong>Product Listed!</strong>
            <span>Redirecting to dashboard…</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateProduct;