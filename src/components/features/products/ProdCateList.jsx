import { useEffect, useState } from 'react';
import { getProductsByIdCategory } from '@/services/ProductService';
import { useNavigate } from 'react-router-dom';
import ProductCard from '@components/common/ProductCard';

const ProductsCategoryList = ({ idCategory }) => {
  const navigate = useNavigate();
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

  const handleAddToCart = (id) => {
    console.log('Add to cart:', id);
  };

  const handleProductClick = (product) => {
    navigate(`/product/${product.id}`);
  };

  console.log('idCategory nhận được:', idCategory);

  return (
    <nav className="section__content section__home-prodCate">
      <div className="block__grid">
        <ProductCard
          products={filteredProducts}
          handleAddToCart={handleAddToCart}
          handleProductClick={handleProductClick}
        />
      </div>
    </nav>
  );
};

export default ProductsCategoryList;
