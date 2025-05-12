import { useEffect, useState } from 'react';
import { getProductsByIdCategory } from '@/services/ProductService';
import { useNavigate } from 'react-router-dom';
import ProductCard from '@components/common/ProductCard';
import { useDispatch, useSelector } from 'react-redux';
import { createAxios } from '@utils/createInstance.jsx';
import { loginSuccess } from '@/redux/authSlice.jsx';
import { addItemToCart } from '@services/CartService';

const ProductsCategoryList = ({ idCategory }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.login.currentUser);
  const accessToken = user?.accessToken;
  const axiosJWT = createAxios(user, dispatch, loginSuccess);
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

  const handleAddToCart = async (product) => {
    if (!product || !product._id) return;

    console.log('Add to cart:', product._id);

    const formData = {
      productId: product._id,
      quantity: 1,
    };

    await addItemToCart(formData, dispatch, accessToken, axiosJWT);
  };

  const handleProductClick = (product) => {
    navigate(`/product/${product._id}`);
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
