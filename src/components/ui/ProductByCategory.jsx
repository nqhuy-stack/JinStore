import { getProductsByCategory } from '@/services/AuthService';
import { useEffect, useState } from 'react';

function ProductByCategory({ idCategory }) {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!idCategory) {
        setError('Không có idCategory được cung cấp');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log(idCategory);
        const data = await getProductsByCategory(idCategory);
        setProducts(data || []); // Đảm bảo data là mảng, nếu không thì set mảng rỗng
      } catch (err) {
        setError(err.message || 'Lỗi khi lấy sản phẩm');
        setProducts([]); // Reset products nếu có lỗi
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [idCategory]); // Thêm idCategory vào dependency array

  // Hiển thị lỗi
  if (error) return <div className="error">Lỗi: {error}</div>;

  // Hiển thị trạng thái tải
  if (loading) return <div>Đang tải...</div>;

  // Hiển thị khi không có sản phẩm
  if (!products.length) return <div>Không có sản phẩm nào trong danh mục này</div>;

  // Hiển thị danh sách sản phẩm
  return (
    <ul>
      {products.map((product) => (
        <li key={product._id}>
          {product.name} - {product.price} VNĐ
        </li>
      ))}
    </ul>
  );
}

export default ProductByCategory;
