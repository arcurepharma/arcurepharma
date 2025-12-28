import React, { useState, useEffect, useRef, useCallback } from "react";
import { products } from "../dependencies/products";
import fallbackImg from "../assets/pics/products/0.jpg";

export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [visibleProducts, setVisibleProducts] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [modalQuantity, setModalQuantity] = useState(1);
  const sentinelRef = useRef(null);

  const showToast = (message) => {
    const id = Date.now();
    const newToast = { id, message, isHiding: false };

    setToasts((prev) => [...prev, newToast]);

    // Start hiding phase
    setTimeout(() => {
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, isHiding: true } : t))
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
      { threshold: 0.1 }
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

  return (
    <>
      <div className="backgroung-modern_home pt-5">
        <div className="floating-shapes">
          <div className="shape"></div>
          <div className="shape"></div>
          <div className="shape"></div>
        </div>

        <div className="container section-spacing">
          <div className="row justify-content-center mb-5">
            <div className="col-lg-8 text-center">
              <span className="hero-subtitle">Premium Wellness</span>
              <h1 className="hero-title mb-4">
                Our <span className="text-gradient">Products</span>
              </h1>
              <p className="op-7 lead">
                Discover our scientifically formulated pharmaceuticals and
                supplements designed for your peak performance and health.
              </p>
            </div>
          </div>

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
                      <span className="product-price">
                        ${product.price.toFixed(2)}
                      </span>
                      <span className="view-details-btn">View Details →</span>
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
                    ${selectedProduct.price.toFixed(2)}
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
                          showToast(
                            `Added ${modalQuantity} ${selectedProduct.name} to cart!`
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
            <div className="toast-icon">✅</div>
            <div className="toast-message">{t.message}</div>
          </div>
        ))}
      </div>
    </>
  );
}
