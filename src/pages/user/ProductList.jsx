// File: src/pages/user/ProductList.jsx
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Pagination from '@components/common/Pagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter, faTags, faDollarSign, faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';
import Breadcrumb from '@components/common/Breadcrumb';
import { getProductsByIdCategory, getProductsAll } from '@services/ProductService';
import { getCategoriesAll } from '@services/CategoryService';
import ProductCard from '@components/common/ProductCard';

const ProductList = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [originalProducts, setOriginalProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 20;

  // Lấy dữ liệu sản phẩm và danh mục khi component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Lấy tất cả danh mục
        const categoriesData = await getCategoriesAll();
        setCategories(categoriesData || []);

        // Lấy tất cả sản phẩm
        const productsData = await getProductsAll();
        setProducts(productsData || []);
        setOriginalProducts(productsData || []);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
        // Đảm bảo không bị crash khi có lỗi
        setCategories([]);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Lọc sản phẩm theo danh mục
  const handleFilter = (e) => {
    const _idCategory = e.target.value;
    setSelectedCategory(_idCategory);
    if (_idCategory === 'all') {
      setProducts(originalProducts); // Hiển thị tất cả danh mục
    } else {
      const filteredProducts = originalProducts.filter((category) => category._idCategory._id === _idCategory);
      setProducts(filteredProducts);
    }
    setCurrentPage(1);
  };

  // Xử lý thêm vào giỏ hàng
  const handleAddToCart = (product) => {
    if (!product) return;
    console.log('Adding to cart:', product);
    // Thêm code xử lý thêm vào giỏ hàng ở đây
  };

  // Xử lý click sản phẩm
  const handleProductClick = (product) => {
    if (!product || !product.id) return;
    navigate(`/product/${product.id}`);
  };

  // Hiển thị skeleton khi loading
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

  // Kiểm tra dữ liệu trả về từ API
  useEffect(() => {
    if (!loading && products.length === 0) {
      console.log('Không có sản phẩm được trả về từ API hoặc có lỗi xảy ra');
    }

    if (!loading && categories.length === 0) {
      console.log('Không có danh mục được trả về từ API hoặc có lỗi xảy ra');
    }
  }, [loading, products, categories]);

  const filteredProducts = products.filter(
    (product) =>
      product._idCategory.status === 'active' && product.name.toLowerCase().includes(searchTerm.toLowerCase().trim()),
  );
  // Tính toán dữ liệu hiển thị trên trang hiện tại
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  return (
    <section className="product-list-container">
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
            </div>

            <div className="filters__section">
              <h3 className="filters__title">
                <FontAwesomeIcon icon={faTags} /> Categories
              </h3>
              <div className="filters__options">
                <>
                  <label key="all" className="filters__option">
                    <input
                      type="checkbox"
                      value="all"
                      checked={selectedCategory === 'all' || selectedCategory === ''}
                      onChange={handleFilter}
                    />
                    All
                  </label>
                  {categories && categories.length > 0 ? (
                    categories.map((category) => (
                      <label key={category._id} className="filters__option">
                        <input
                          type="checkbox"
                          value={category._id}
                          checked={selectedCategory === category._id}
                          onChange={handleFilter}
                        />
                        {category.name}
                      </label>
                    ))
                  ) : (
                    <p>No categories available</p>
                  )}
                </>
              </div>
            </div>
          </aside>

          <div className="product-list__main">
            <div className="product-list__toolbar">
              <p className="products-count">
                Showing {totalItems > 0 ? `${startIndex + 1}-${Math.min(endIndex, totalItems)} of ${totalItems}` : '0'}{' '}
                products
              </p>
              <div className="products-sort">
                <label htmlFor="sort-select">Sort by:</label>
                <select
                  id="sort-select"
                  className="sort-select" /* onChange={handleSortChange} */ /* value={sortOption} */
                >
                  <option value="popularity">Most Popular</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>
            </div>

            <div className="product-list__grid">
              {loading ? (
                renderSkeleton()
              ) : currentProducts && currentProducts.length > 0 ? (
                <ProductCard
                  products={currentProducts}
                  handleAddToCart={handleAddToCart}
                  handleProductClick={handleProductClick}
                />
              ) : (
                <div className="no-products">
                  <h3>No products found</h3>
                  <p>Try adjusting your search or filter criteria</p>
                </div>
              )}
            </div>
          </div>
        </div>
        {!loading && totalPages > 1 && (
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(page) => setCurrentPage(page)} />
        )}
      </div>
    </section>
  );
};

export default ProductList;
