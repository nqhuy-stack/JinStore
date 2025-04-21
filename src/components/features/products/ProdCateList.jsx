import { useEffect, useState } from 'react';
import { getProductsByIdCategory } from '@/services/AuthService';

const ProductsCategoryList = ({ idCategory }) => {
  const [filteredProducts, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProductsByIdCategory(idCategory);
        setProducts(Array.isArray(data) ? data : []);
        console.log('Dữ liệu sản phẩm:', data);
      } catch (error) {
        console.error('Lỗi khi lấy danh mục:', error);
      }
    };

    fetchProducts();
  }, [idCategory]);

  console.log('idCategory nhận được:', idCategory);

  return (
    <nav className="section__content section__home-prodCate">
      <h2>Sản phẩm theo danh mục: {filteredProducts?.length ?? 0} sản phẩm</h2>
      <ul>
        {filteredProducts.length > 0 ? (
          filteredProducts
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((product) => (
              <li key={product._id} className="product-item">
                <img
                  src={product.images[1]?.url || 'https://sonnptnt.thaibinh.gov.vn/App/images/no-image-news.png'}
                  alt={product.name}
                  width="15%"
                />
                <div>
                  <strong>{product.name}</strong>
                  <p>Giá: {product.price.toLocaleString()} VNĐ</p>
                  <p>Giảm giá: {product.discount * 100} %</p>
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
