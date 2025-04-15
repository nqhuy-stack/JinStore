// File: src/pages/user/ProductList.jsx
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Pagination from '@components/common/Pagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faFilter,
  faTags,
  faDollarSign,
  faStar,
  faTimes,
  faCheck,
  faHeart,
  faLeaf,
  faCartPlus,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import Breadcrumb from '@components/common/Breadcrumb';

const ProductList = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [products] = useState([
    // Coffee Products
    {
      id: 1,
      name: 'Premium Coffee Beans',
      price: 29.99,
      image:
        'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      category: 'Coffee',
      rating: 4.5,
      reviews: 128,
      description: 'Carefully selected Arabica coffee beans roasted to perfection. Rich and full-bodied flavor.',
    },
    {
      id: 2,
      name: 'Espresso Blend',
      price: 24.99,
      image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      category: 'Coffee',
      rating: 4.7,
      reviews: 95,
      description: 'Dark roasted espresso blend with notes of chocolate and caramel. Perfect for espresso machines.',
    },
    {
      id: 3,
      name: 'Cold Brew Coffee',
      price: 19.99,
      image:
        'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      category: 'Coffee',
      rating: 4.6,
      reviews: 156,
      description: 'Smooth and refreshing cold brew coffee concentrate. Low acidity and naturally sweet.',
    },

    // Tea Products
    {
      id: 4,
      name: 'Organic Green Tea',
      price: 19.99,
      image:
        'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      category: 'Tea',
      rating: 4.8,
      reviews: 256,
      description: 'Premium organic green tea leaves harvested from high mountain regions. Rich in antioxidants.',
    },
    {
      id: 5,
      name: 'Earl Grey Tea',
      price: 15.99,
      image:
        'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      category: 'Tea',
      rating: 4.4,
      reviews: 89,
      description: 'Classic Earl Grey tea with bergamot oil. Aromatic and refreshing black tea blend.',
    },
    {
      id: 6,
      name: 'Chamomile Tea',
      price: 12.99,
      image:
        'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      category: 'Tea',
      rating: 4.6,
      reviews: 167,
      description: 'Soothing herbal tea made from pure chamomile flowers. Caffeine-free and relaxing.',
    },

    // Bakery Products
    {
      id: 7,
      name: 'Artisanal Bread',
      price: 8.99,
      image:
        'https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      category: 'Bakery',
      rating: 4.6,
      reviews: 89,
      description: 'Handcrafted sourdough bread made with traditional methods. Crispy crust and soft interior.',
    },
    {
      id: 8,
      name: 'Croissant',
      price: 4.99,
      image:
        'https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      category: 'Bakery',
      rating: 4.7,
      reviews: 234,
      description: 'Buttery and flaky French croissants. Baked fresh daily using premium European butter.',
    },
    {
      id: 9,
      name: 'Sourdough Bread',
      price: 9.99,
      image:
        'https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      category: 'Bakery',
      rating: 4.8,
      reviews: 178,
      description: 'Naturally fermented sourdough bread with a tangy flavor and rustic crust. No additives.',
    },

    // Snacks Products
    {
      id: 10,
      name: 'Mixed Nuts',
      price: 14.99,
      image:
        'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      category: 'Snacks',
      rating: 4.5,
      reviews: 145,
      description: 'Premium selection of roasted nuts including almonds, cashews, and walnuts. Lightly salted.',
    },
    {
      id: 11,
      name: 'Dark Chocolate',
      price: 12.99,
      image:
        'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      category: 'Snacks',
      rating: 4.7,
      reviews: 198,
      description: '72% dark chocolate made from ethically sourced cocoa beans. Rich and intense flavor.',
    },
    {
      id: 12,
      name: 'Granola Bars',
      price: 9.99,
      image:
        'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      category: 'Snacks',
      rating: 4.4,
      reviews: 112,
      description: 'Wholesome granola bars made with oats, honey, and dried fruits. Perfect for on-the-go snacking.',
    },

    // Additional Products
    ...Array.from({ length: 24 }, (_, i) => ({
      id: i + 13,
      name: [
        'Premium Coffee Beans',
        'Organic Green Tea',
        'Artisanal Bread',
        'Mixed Nuts',
        'Dark Chocolate',
        'Granola Bars',
        'Espresso Blend',
        'Earl Grey Tea',
        'Croissant',
        'Sourdough Bread',
        'Cold Brew Coffee',
        'Chamomile Tea',
      ][i % 12],
      price: Math.floor(Math.random() * 30) + 10,
      image: `https://source.unsplash.com/random/500x500?${['coffee', 'tea', 'bread', 'snacks'][i % 4]}&sig=${i}`,
      category: ['Coffee', 'Tea', 'Bakery', 'Snacks'][i % 4],
      rating: (Math.random() * 2 + 3).toFixed(1),
      reviews: Math.floor(Math.random() * 200) + 50,
    })),
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    categories: [],
    priceRange: { min: 0, max: 100 },
    rating: 0,
  });
  const itemsPerPage = 20;
  const [sortOption, setSortOption] = useState('popularity');

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Get unique categories
  const categories = [...new Set(products.map((product) => product.category))];

  // Sort products based on selected option
  const sortProducts = (products, option) => {
    switch (option) {
      case 'price-low':
        return [...products].sort((a, b) => a.price - b.price);
      case 'price-high':
        return [...products].sort((a, b) => b.price - a.price);
      case 'rating':
        return [...products].sort((a, b) => b.rating - a.rating);
      case 'newest':
        return [...products].sort((a, b) => b.id - a.id);
      case 'popularity':
      default:
        return [...products].sort((a, b) => b.reviews - a.reviews);
    }
  };

  // Filter products based on search and filters
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = filters.categories.length === 0 || filters.categories.includes(product.category);

      const matchesPrice = product.price >= filters.priceRange.min && product.price <= filters.priceRange.max;

      const matchesRating = filters.rating === 0 || product.rating >= filters.rating;

      return matchesSearch && matchesCategory && matchesPrice && matchesRating;
    });
  }, [products, searchTerm, filters]);

  // Apply sorting after filtering
  const sortedAndFilteredProducts = useMemo(() => {
    return sortProducts(filteredProducts, sortOption);
  }, [filteredProducts, sortOption]);

  const totalItems = sortedAndFilteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = sortedAndFilteredProducts.slice(startIndex, endIndex);

  // Handle sorting change
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    setCurrentPage(1); // Reset to first page when sorting changes

    // Show loading briefly for better UX
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 300);
  };

  const handleCategoryChange = (category) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Add this function to handle price range validation
  const validatePriceRange = (min, max) => {
    let validMin = Math.max(0, Math.min(min, 100));
    let validMax = Math.max(0, Math.min(max, 100));

    if (validMin > validMax) {
      [validMin, validMax] = [validMax, validMin];
    }

    return { min: validMin, max: validMax };
  };

  const handlePriceRangeChange = (min, max) => {
    const validRange = validatePriceRange(min, max);
    setFilters((prev) => ({
      ...prev,
      priceRange: validRange,
    }));
    setCurrentPage(1);
  };

  const handleRatingChange = (rating) => {
    setFilters((prev) => ({
      ...prev,
      rating,
    }));
    setCurrentPage(1);
  };

  const handleAddToCart = (product) => {
    // TODO: Implement add to cart functionality
    console.log('Adding to cart:', product);
  };

  const handleClearFilters = () => {
    setFilters({
      categories: [],
      priceRange: { min: 0, max: 100 },
      rating: 0,
    });
    setCurrentPage(1);
  };

  const hasActiveFilters = () => {
    return (
      filters.categories.length > 0 || filters.priceRange.min > 0 || filters.priceRange.max < 100 || filters.rating > 0
    );
  };

  const [favorites, setFavorites] = useState(new Set());

  const toggleFavorite = (productId) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      return newFavorites;
    });
  };

  const handleProductClick = (product) => {
    navigate(`/product/${product.id}`);
  };

  // Render loading skeleton
  const renderSkeleton = () => {
    return Array(8)
      .fill(null)
      .map((_, index) => (
        <div key={index} className="user__product-card skeleton">
          <div className="user__product-image-container skeleton-image"></div>
          <div className="user__product-info">
            <div className="skeleton-text"></div>
            <div className="skeleton-text"></div>
            <div className="skeleton-text"></div>
          </div>
        </div>
      ));
  };

  return (
    <section className="">
      <Breadcrumb items={[{ text: 'Products' }]} />
      <div className="product-list">
        <div className="product-list__header">
          <div className="product-list__header-content">
            <h2 className="title">Our Products</h2>
            <p className="subtitle">Discover our curated selection of premium products</p>
          </div>
          <div className="product-list__search">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="product-list__content">
          <aside className="product-list__filters">
            <div className="filters__header">
              <h3>
                <FontAwesomeIcon icon={faFilter} /> Filters
              </h3>
              {hasActiveFilters() && (
                <button className="clear-filters" onClick={handleClearFilters}>
                  <FontAwesomeIcon icon={faTimes} /> Clear All
                </button>
              )}
            </div>

            <div className="filters__section">
              <h3 className="filters__title">
                <FontAwesomeIcon icon={faTags} /> Categories
              </h3>
              <div className="filters__options">
                {categories.map((category) => (
                  <label key={category} className="filters__option">
                    <input
                      type="checkbox"
                      checked={filters.categories.includes(category)}
                      onChange={() => handleCategoryChange(category)}
                    />
                    <span>{category}</span>
                    {filters.categories.includes(category) && (
                      <FontAwesomeIcon icon={faCheck} className="filters__check" />
                    )}
                  </label>
                ))}
              </div>
            </div>

            <div className="filters__section">
              <h3 className="filters__title">
                <FontAwesomeIcon icon={faDollarSign} /> Price Range
              </h3>
              <div className="price-range">
                <div className="price-slider">
                  <div className="slider-track"></div>
                  <div
                    className="slider-track-active"
                    style={{
                      left: `${filters.priceRange.min}%`,
                      width: `${filters.priceRange.max - filters.priceRange.min}%`,
                    }}
                  ></div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={filters.priceRange.min}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      const max = filters.priceRange.max;
                      if (value <= max) {
                        handlePriceRangeChange(value, max);
                      }
                    }}
                    className="price-slider min-slider"
                  />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={filters.priceRange.max}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      const min = filters.priceRange.min;
                      if (value >= min) {
                        handlePriceRangeChange(min, value);
                      }
                    }}
                    className="price-slider max-slider"
                  />
                </div>
                <div className="price-inputs">
                  <div className="price-input-group">
                    <span className="currency">$</span>
                    <input
                      type="number"
                      value={filters.priceRange.min}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        if (!isNaN(value) && value >= 0 && value < filters.priceRange.max) {
                          handlePriceRangeChange(value, filters.priceRange.max);
                        }
                      }}
                      min="0"
                      max="99"
                    />
                  </div>
                  <span className="separator">-</span>
                  <div className="price-input-group">
                    <span className="currency">$</span>
                    <input
                      type="number"
                      value={filters.priceRange.max}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        if (!isNaN(value) && value > filters.priceRange.min && value <= 100) {
                          handlePriceRangeChange(filters.priceRange.min, value);
                        }
                      }}
                      min="1"
                      max="100"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="filters__section">
              <h3 className="filters__title">
                <FontAwesomeIcon icon={faStar} /> Minimum Rating
              </h3>
              <div className="rating-filter">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <label key={rating} className="filters__option">
                    <input
                      type="radio"
                      name="rating"
                      checked={filters.rating === rating}
                      onChange={() => handleRatingChange(rating)}
                    />
                    <span>
                      {[...Array(rating)].map((_, i) => (
                        <FontAwesomeIcon key={i} icon={faStar} />
                      ))}
                      {rating > 0 && ' & up'}
                    </span>
                    {filters.rating === rating && <FontAwesomeIcon icon={faCheck} className="filters__check" />}
                  </label>
                ))}
              </div>
            </div>
          </aside>

          <div className="product-list__main">
            <div className="product-list__toolbar">
              <p className="products-count">
                Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems} products
              </p>
              <div className="products-sort">
                <label htmlFor="sort-select">Sort by:</label>
                <select id="sort-select" className="sort-select" onChange={handleSortChange} value={sortOption}>
                  <option value="popularity">Most Popular</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>

            <div className="product-list__grid">
              {loading
                ? renderSkeleton()
                : currentProducts.map((product) => (
                    <div
                      key={product.id}
                      className="product-card"
                      onClick={(e) => {
                        e.preventDefault();
                        handleProductClick(product);
                      }}
                    >
                      <div className="product-card__inner">
                        {product.discount && <div className="product-badge">-{product.discount}% OFF</div>}

                        <button
                          className={`product-favorite ${favorites.has(product.id) ? 'active' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(product.id);
                          }}
                          aria-label={favorites.has(product.id) ? 'Remove from favorites' : 'Add to favorites'}
                        >
                          <FontAwesomeIcon icon={faHeart} />
                        </button>

                        <div className="product-image">
                          <img
                            src={product.image}
                            alt={product.name}
                            onError={(e) => {
                              e.target.src = '/images/placeholder.jpg';
                            }}
                          />
                          {product.isOrganic && (
                            <div className="product-organic">
                              <FontAwesomeIcon icon={faLeaf} />
                              ORGANIC
                            </div>
                          )}
                        </div>

                        <div className="product-info">
                          <div className="product-category">{product.category}</div>
                          <h3 className="product-name">{product.name}</h3>

                          <div className="product-rating">
                            <div className="stars">
                              {[...Array(5)].map((_, i) => (
                                <FontAwesomeIcon
                                  key={i}
                                  icon={faStar}
                                  className={i < Math.floor(product.rating) ? 'filled' : ''}
                                />
                              ))}
                            </div>
                            <span className="rating-text">
                              {product.rating} ({product.reviews} reviews)
                            </span>
                          </div>

                          <div className="product-description">
                            {product.description || 'High-quality product from trusted suppliers.'}
                          </div>

                          <div className="product-price">
                            <span className="current-price">
                              ${(product.price * (1 - (product.discount || 0) / 100)).toFixed(2)}
                            </span>
                            {product.discount && <span className="original-price">${product.price.toFixed(2)}</span>}
                          </div>

                          <div className="product-footer">
                            {product.inStock ? (
                              <div className="product-stock">
                                <FontAwesomeIcon icon={faCheck} />
                                IN STOCK
                              </div>
                            ) : (
                              <div className="product-stock out">
                                <FontAwesomeIcon icon={faTimes} />
                                OUT OF STOCK
                              </div>
                            )}

                            <button
                              className="add-to-cart"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddToCart(product);
                              }}
                              disabled={!product.inStock}
                            >
                              {loading ? (
                                <FontAwesomeIcon icon={faSpinner} spin />
                              ) : (
                                <>
                                  <FontAwesomeIcon icon={faCartPlus} />
                                  Add to Cart
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
            </div>

            {!loading && currentProducts.length === 0 && (
              <div className="no-products">
                <h3>No products found</h3>
                <p>Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        </div>

        {!loading && (
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(page) => setCurrentPage(page)} />
        )}
      </div>
    </section>
  );
};

export default ProductList;
