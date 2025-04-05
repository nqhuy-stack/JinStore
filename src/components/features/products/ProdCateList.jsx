import { useEffect, useState } from 'react';
import { getProductsByIdCategory } from '@/services/AuthService';

const ProductsCategoryList = ({ idCategory }) => {
  const [filteredProducts, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProductsByIdCategory(idCategory);
        setProducts(data);
        console.log('Dữ liệu sản phẩm:', data);
      } catch (error) {
        console.error('Lỗi khi lấy danh mục:', error);
      }
    };

    fetchProducts();
  }, []);

  console.log('idCategory nhận được:', idCategory);

  return (
    <nav className="section__content section__home-prodCate">
      <h2>Sản phẩm theo danh mục {filteredProducts.length}</h2>
      <ul>
        {filteredProducts.length > 0 ? (
          filteredProducts
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((product) => (
              <li key={product._id} className="product-item">
                <img
                  src={product.images?.[0] || 'https://via.placeholder.com/150'}
                  alt={product.name}
                  width="100"
                  height="100"
                />
                <div>
                  <strong>{product.name}</strong>
                  <p>Giá: {product.price.toLocaleString()} VNĐ</p>
                  <p>Giảm giá: {product.discount}%</p>
                </div>
              </li>
            ))
        ) : (
          <p>Không có sản phẩm nào trong danh mục này.</p>
        )}
      </ul>
    </nav>
  );
};

export default ProductsCategoryList;
