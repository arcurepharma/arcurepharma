import React, { useState, useEffect, useRef, useCallback } from "react";
import { products } from "../dependencies/products";
import fallbackImg from "../assets/pics/products/0.jpg";
import { useCart } from "../context/CartContext";
import HeroSection from "../components/shared/HeroSection";

export default function Home() {
  const { addToCart } = useCart();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [visibleProducts, setVisibleProducts] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [modalQuantity, setModalQuantity] = useState(1);
  const sentinelRef = useRef(null);
  const autoSlideRef = useRef(null);

  const showToast = (message) => {
    const id = Date.now();
    const newToast = { id, message, isHiding: false };

    setToasts((prev) => [...prev, newToast]);

    // Start hiding phase
    setTimeout(() => {
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, isHiding: true } : t)),
      );

      // Remove from array after animation
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 500);
    }, 3000);
  };

  const handleLoadMore = useCallback(() => {
    if (isLoading || visibleProducts >= products.length) return;

    setIsLoading(true);
    // Simulate network delay for a premium feel and smooth transition
    setTimeout(() => {
      setVisibleProducts((prev) => prev + 5);
      setIsLoading(false);
    }, 800);
  }, [isLoading, visibleProducts]);

  useEffect(() => {
    const currentSentinel = sentinelRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          handleLoadMore();
        }
      },
      { threshold: 0.1 },
    );

    if (currentSentinel) {
      observer.observe(currentSentinel);
    }

    return () => {
      if (currentSentinel) {
        observer.unobserve(currentSentinel);
      }
    };
  }, [handleLoadMore]);

  const handleImageError = (e, product) => {
    // If it was the external URL failing, try the local path
    if (e.target.src === product.imageUrl && product.imagePath) {
      e.target.src = product.imagePath;
    }
    // Otherwise (or if local path also fails), use the global fallback
    else if (e.target.src !== fallbackImg) {
      e.target.src = fallbackImg;
    }
  };

  const getInitialImage = (product) => {
    return product.imageUrl || product.imagePath || fallbackImg;
  };

  const openModal = (product) => {
    setSelectedProduct(product);
    setModalQuantity(1); // Set default quantity to 1 when opening
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setSelectedProduct(null);
    document.body.style.overflow = "auto";
  };

  // ─── Discount Banner ────────────────────────────────────────────────
  const [bannerOpen, setBannerOpen] = useState(false);
  const [discountedProducts, setDiscountedProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const discountPct = (p) =>
    Math.round(
      ((Number(p.price) - Number(p.discountedPrice)) / Number(p.price)) * 100,
    );

  // Seed discounted products, open after 800 ms
  useEffect(() => {
    const discounted = products.filter(
      (p) =>
        Number(p.discountedPrice) > 0 &&
        Number(p.discountedPrice) < Number(p.price),
    );
    setDiscountedProducts(discounted);
    if (discounted.length > 0) {
      const t = setTimeout(() => {
        setBannerOpen(true);
        document.body.style.overflow = "hidden";
      }, 800);
      return () => clearTimeout(t);
    }
  }, []);

  // Auto-slide every 4 s
  useEffect(() => {
    if (!bannerOpen || discountedProducts.length <= 1) return;
    autoSlideRef.current = setInterval(() => bannerNavigate("next"), 4000);
    return () => clearInterval(autoSlideRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bannerOpen, currentIndex, discountedProducts.length]);

  const bannerNavigate = (dir) => {
    clearInterval(autoSlideRef.current);
    setCurrentIndex((prev) =>
      dir === "next"
        ? (prev + 1) % discountedProducts.length
        : (prev - 1 + discountedProducts.length) % discountedProducts.length,
    );
  };

  const closeBanner = () => {
    setBannerOpen(false);
    document.body.style.overflow = "auto";
  };

  const handleBannerAddToCart = (product) => {
    addToCart(product, 1);
    showToast(`🎉 ${product.name} added to cart!`);
    closeBanner();
  };
  return (
    <>
      {/* ══════════════ PREMIUM DISCOUNT BANNER ══════════════ */}
      {bannerOpen &&
        discountedProducts.length > 0 &&
        (() => {
          const p = discountedProducts[currentIndex];
          const pct = discountPct(p);
          const isMega = pct >= 25;
          const total = discountedProducts.length;
          return (
            <div className="db-overlay" onClick={closeBanner}>
              <div className="db-shell" onClick={(e) => e.stopPropagation()}>
                {/* ── Dynamic "Aura" background ── */}
                <div className="db-aura" />

                {/* ── Animated marquee ribbon ── */}
                <div className={`db-ribbon${isMega ? " db-ribbon--mega" : ""}`}>
                  <span className="db-marquee">
                    {isMega
                      ? "🚀 MEGA SALE — LIMITED TIME ONLY — "
                      : "🔥 HOT DEALS — HANDPICKED FOR YOU — "}
                    {total} exclusive deal{total > 1 ? "s" : ""} active now
                    &nbsp;&nbsp;·&nbsp;&nbsp;
                    {isMega
                      ? "🚀 MEGA SALE — LIMITED TIME ONLY — "
                      : "🔥 HOT DEALS — HANDPICKED FOR YOU — "}
                    {total} exclusive deal{total > 1 ? "s" : ""} active now
                  </span>
                </div>

                {/* ── Close ── */}
                <button
                  className="db-close"
                  onClick={closeBanner}
                  aria-label="Close"
                >
                  ✕
                </button>

                {/* ── Body ── */}
                <div className="db-body">
                  {/* Left – Image with 3D Float */}
                  <div className="db-img-col">
                    <div className="db-img-container">
                      <img
                        key={currentIndex}
                        src={getInitialImage(p)}
                        alt={p.name}
                        className="db-img"
                        onError={(e) => handleImageError(e, p)}
                      />
                    </div>
                    {/* Floating % badge */}
                    <div
                      className={`db-badge${isMega ? " db-badge--mega" : ""}`}
                    >
                      <span className="db-badge-pct">{pct}%</span>
                      <span className="db-badge-off">OFF</span>
                    </div>
                  </div>

                  {/* Right – info */}
                  <div className="db-info-col">
                    <span className="db-cat">{p.category}</span>
                    <h2 className="db-name">{p.name}</h2>

                    <div
                      className={`db-deal-pill${isMega ? " db-deal-pill--mega" : ""}`}
                    >
                      🎉 You save Rs. {(
                        Number(p.price) - Number(p.discountedPrice)
                      ).toLocaleString()}
                    </div>

                    <div className="db-prices">
                      <span className="db-price-now">
                        Rs.&nbsp;{Number(p.discountedPrice).toLocaleString()}
                      </span>
                      <span className="db-price-was">
                        Rs.&nbsp;{Number(p.price).toLocaleString()}
                      </span>
                    </div>
                    <span className="db-savings">
                      🎉 Instant Savings: Rs.&nbsp;
                      {(
                        Number(p.price) - Number(p.discountedPrice)
                      ).toLocaleString()}
                    </span>

                    {p.shortDescription && (
                      <p className="db-desc">{p.shortDescription}</p>
                    )}

                    <div className="db-cta">
                      <button
                        className="db-btn-buy"
                        onClick={() => handleBannerAddToCart(p)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="9" cy="21" r="1" />
                          <circle cx="20" cy="21" r="1" />
                          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                        </svg>
                      </button>
                      <button className="db-btn-skip" onClick={closeBanner}>
                        Maybe later
                      </button>
                    </div>

                    {total > 1 && (
                      <div className="db-dots">
                        {discountedProducts.map((_, i) => (
                          <button
                            key={i}
                            className={`db-dot${i === currentIndex ? " db-dot--on" : ""}`}
                            onClick={() => {
                              setCurrentIndex(i);
                              clearInterval(autoSlideRef.current);
                            }}
                            aria-label={`Deal ${i + 1}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* ── Progress Line ── */}
                {total > 1 && (
                  <div className="db-progress">
                    <div key={currentIndex} className="db-progress-fill" />
                  </div>
                )}

                {/* ── Desktop prev/next ── */}
                {total > 1 && (
                  <>
                    <button
                      className="db-arrow db-arrow--prev"
                      onClick={() => bannerNavigate("prev")}
                      aria-label="Previous"
                    >
                      ‹
                    </button>
                    <button
                      className="db-arrow db-arrow--next"
                      onClick={() => bannerNavigate("next")}
                      aria-label="Next"
                    >
                      ›
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })()}
      <div className="bg-modern pt-5">
        <div className="floating-shapes">
          <div className="shape"></div>
          <div className="shape"></div>
          <div className="shape"></div>
        </div>

        <div className="container section-spacing">
          <HeroSection
            subtitle="Premium Wellness"
            title={
              <>
                Our <span className="text-gradient">Products</span>
              </>
            }
            description="Discover our scientifically formulated pharmaceuticals and supplements designed for your peak performance and health."
          />

          <div className="row g-4 product-grid">
            {products.slice(0, visibleProducts).map((product, index) => (
              <div
                className="col-xl-3 col-lg-4 col-sm-6 col-12 reveal-item"
                key={`${product.id}-${index}`}
              >
                <div
                  className="product-card"
                  onClick={() => openModal(product)}
                >
                  <div className="product-img-container">
                    <img
                      src={getInitialImage(product)}
                      alt={product.name}
                      className="product-img"
                      onError={(e) => handleImageError(e, product)}
                    />

                    <div className="product-category-badge">
                      {product.category}
                    </div>
                  </div>
                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-short-desc">
                      {product.shortDescription}
                    </p>

                    <div className="product-footer">
                      {Number(product.discountedPrice) > 0 &&
                        Number(product.discountedPrice) <
                          Number(product.price) && (
                          <span className="save-tag">
                            {Math.round(
                              ((Number(product.price) -
                                Number(product.discountedPrice)) /
                                Number(product.price)) *
                                100,
                            ) > 25
                              ? `🚀 MEGA Discount ${Math.round(
                                  ((Number(product.price) -
                                    Number(product.discountedPrice)) /
                                    Number(product.price)) *
                                    100,
                                )}%`
                              : `🔥 ${Math.round(
                                  ((Number(product.price) -
                                    Number(product.discountedPrice)) /
                                    Number(product.price)) *
                                    100,
                                )}% OFF`}
                          </span>
                        )}

                      <div className="price-area">
                        <div className="price-group">
                          <span className="discounted-price">
                            Rs.{" "}
                            {Number(
                              product.discountedPrice > 0
                                ? product.discountedPrice
                                : product.price,
                            ).toLocaleString()}
                          </span>
                          {Number(product.discountedPrice) > 0 &&
                            Number(product.discountedPrice) <
                              Number(product.price) && (
                              <span className="original-price">
                                Rs. {Number(product.price).toLocaleString()}
                              </span>
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sentinel & Pagination Section */}
          <div
            ref={sentinelRef}
            className="pagination-container mt-5"
            style={{ minHeight: "20px" }}
          >
            {isLoading && (
              <div className="products-loader">
                <div className="spinner-glow"></div>
                <span className="loading-text">
                  Discovering more products...
                </span>
              </div>
            )}
            {!isLoading &&
              visibleProducts >= products.length &&
              products.length > 0 && (
                <p className="text-center op-5 mt-4">
                  You've explored all our excellence.
                </p>
              )}
          </div>
        </div>
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="product-modal-overlay" onClick={closeModal}>
          <div
            className="product-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close-btn" onClick={closeModal}>
              &times;
            </button>
            <div className="row g-0">
              <div className="col-md-6">
                <div className="modal-img-container">
                  <img
                    src={getInitialImage(selectedProduct)}
                    alt={selectedProduct.name}
                    className="modal-img"
                    onError={(e) => handleImageError(e, selectedProduct)}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="modal-details">
                  <span className="modal-category">
                    {selectedProduct.category}
                  </span>
                  <h2 className="modal-title">{selectedProduct.name}</h2>
                  <div className="modal-price">
                    {Number(selectedProduct.discountedPrice) > 0 &&
                    Number(selectedProduct.discountedPrice) <
                      Number(selectedProduct.price) ? (
                      <>
                        <span className="discounted-price">
                          Rs.{" "}
                          {Number(
                            selectedProduct.discountedPrice,
                          ).toLocaleString()}
                        </span>
                        <span className="original-price">
                          Rs. {Number(selectedProduct.price).toLocaleString()}
                        </span>
                        <span className="modal-save-tag">
                          🎉 You save Rs.{" "}
                          {(
                            Number(selectedProduct.price) -
                            Number(selectedProduct.discountedPrice)
                          ).toLocaleString()}
                        </span>
                      </>
                    ) : (
                      <span className="discounted-price">
                        Rs. {Number(selectedProduct.price).toLocaleString()}
                      </span>
                    )}
                  </div>
                  <p className="modal-description">
                    {selectedProduct.description}
                  </p>

                  <div className="modal-features">
                    <h5>Key Features:</h5>
                    <ul>
                      {selectedProduct.features.map((feature, idx) => (
                        <li key={idx}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                  <a
                    href={selectedProduct.pdf}
                    download
                    className="btn-download-brochure"
                  >
                    📄 Download Brochure
                  </a>

                  <div className="modal-quantity-wrapper">
                    <span className="modal-quantity-label">Quantity</span>
                    <div className="product-actions">
                      <div className="quantity-selector">
                        <button
                          className="qty-btn"
                          onClick={() =>
                            setModalQuantity(Math.max(1, modalQuantity - 1))
                          }
                          disabled={modalQuantity <= 1}
                        >
                          −
                        </button>
                        <span className="qty-value">{modalQuantity}</span>
                        <button
                          className="qty-btn"
                          onClick={() => setModalQuantity(modalQuantity + 1)}
                        >
                          +
                        </button>
                      </div>
                      <button
                        className="btn-cart modal-action-btn"
                        style={{ marginTop: 0 }}
                        onClick={() => {
                          addToCart(selectedProduct, modalQuantity);
                          showToast(
                            `Added ${modalQuantity} ${selectedProduct.name} to cart!`,
                          );
                          closeModal();
                        }}
                        aria-label="Add to cart"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="9" cy="21" r="1" />
                          <circle cx="20" cy="21" r="1" />
                          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modern Stacking Toast Banner */}
      <div className="modern-toast-container">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`modern-toast ${t.isHiding ? "hiding" : ""}`}
            style={{ marginTop: "10px" }}
          >
            <div className="toast-message">{t.message}</div>
          </div>
        ))}
      </div>
    </>
  );
}
