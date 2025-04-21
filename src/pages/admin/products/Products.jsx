// File: src/pages/admin/Products.jsx
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Modal from '@components/common/Modal';
import { loginSuccess } from '@/redux/authSlice.jsx';
import Pagination from '@components/common/Pagination';
import { createAxios } from '@utils/createInstance.jsx';
import { getProductsAll, editProduct, deleteProduct } from '@services/ProductService';
import { getCategoriesAll } from '@services/CategoryService';
import PageLoad from '@pages/PageLoad';

const Products = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [originalProducts, setOriginalProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [idProdDel, setIdProdDel] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const user = useSelector((state) => state.auth.login.currentUser);
  const accessToken = user?.accessToken;
  const axiosJWT = createAxios(user, dispatch, loginSuccess);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getProductsAll();
        setOriginalProducts(data);

        if (data && Array.isArray(data)) {
          setProducts(data);
        } else {
          setError('Dữ liệu danh mục không hợp lệ');
        }
      } catch {
        setError('Không thể tải danh mục. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log('🔍 Starting to fetch categories...');
        setLoading(true);
        setError(null);

        const data = await getCategoriesAll();
        console.log(`✅ Fetched ${data.length} categories`);
        if (data && Array.isArray(data)) {
          setCategories(
            data.map((cat) => ({
              ...cat,
              name: cat.name,
            })),
          );
        } else {
          console.error('❌ Received invalid data format:', data);
          setError('Dữ liệu danh mục không hợp lệ');
        }
      } catch (err) {
        console.error('❌ Error in fetchCategories:', err);

        setError('Không thể tải danh mục. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleFilter = (e) => {
    const _idCategory = e.target.value;
    if (_idCategory === 'all') {
      setProducts(originalProducts); // Hiển thị tất cả danh mục
    } else {
      const filteredProducts = originalProducts.filter((category) => category._idCategory._id === _idCategory);
      setProducts(filteredProducts);
    }
    setCurrentPage(1); // Reset to first page
  };

  const handleViewProduct = async (id, isActive) => {
    try {
      const newIsActive = isActive ? false : true;
      await editProduct(id, { isActive: newIsActive }, accessToken, axiosJWT);
      setProducts((prev) => prev.map((prod) => (prod._id === id ? { ...prod, isActive: newIsActive } : prod)));
      setOriginalProducts((prev) => prev.map((prod) => (prod._id === id ? { ...prod, isActive: newIsActive } : prod)));

      const activeProducts = products.filter((prod) => prod.isActive);
      const newTotalPages = Math.ceil(activeProducts.length / itemsPerPage);
      if (currentPage > newTotalPages) {
        setCurrentPage(Math.max(1, newTotalPages));
      }
    } catch (error) {
      console.error('❌ Lỗi khi cập nhật trạng thái:', error);
    }
  };

  const handleEditProduct = (id) => {
    navigate(`/admin/products/edit/${id}`);
  };

  const handleDeleteProduct = (id) => {
    console.log(`🗑️ Opening delete modal for product: ${id}`);
    setIdProdDel(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteProduct = async () => {
    setLoading(true);
    try {
      await deleteProduct(idProdDel, accessToken, axiosJWT);
      setProducts((prev) => prev.filter((prod) => prod._id !== idProdDel));
      setOriginalProducts((prev) => prev.filter((prod) => prod._id !== idProdDel));

      const activeProducts = products.filter((prod) => prod.isActive);
      const newTotalPages = Math.ceil(activeProducts.length / itemsPerPage);
      if (currentPage > newTotalPages) {
        setCurrentPage(Math.max(1, newTotalPages));
      }
    } catch (err) {
      console.error('❌ Lỗi khi xóa danh mục:', err);
    } finally {
      setIsDeleteModalOpen(false);
      setIdProdDel(null);
      setLoading(false);
    }
  };

  const handleAddProduct = () => {
    navigate('/admin/products/add');
  };

  const handleImportExport = () => {
    alert('Import/Export functionality not implemented yet.');
  };

  const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()));

  // Tính toán dữ liệu hiển thị trên trang hiện tại
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  return (
    <section className="admin__section">
      <div className="admin__section-header">
        <h2 className="admin__section-title">All Products</h2>
        <div className="admin__section-actions">
          <button className="admin__import-export-button" onClick={handleImportExport}>
            Import Export
          </button>
          <button className="admin__add-button" onClick={handleAddProduct}>
            + Add New
          </button>
        </div>
      </div>
      <div className="admin__search-bar">
        <select className="custom-select" onChange={handleFilter}>
          <option value="all">Tất cả</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Search by Category Name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {loading ? (
        !error && <PageLoad zIndex="1" />
      ) : (
        <>
          <div className="admin__table-wrapper">
            <table className="admin__table block__table">
              <thead>
                <tr>
                  <th className="th-status">Trạng thái</th>
                  <th className="th-img">Ảnh</th>
                  <th className="th-name">Tên</th>
                  <th className="th-description">Mô tả</th>
                  <th className="th-category">Danh mục</th>
                  <th className="th-quantity">Số lượng</th>
                  <th className="th-unit">Đơn vị</th>
                  <th className="th-price">Giá (1 Đơn vị)</th>
                  <th className="th-discount">Giảm giá</th>
                  <th className="th-option">Tùy chỉnh</th>
                </tr>
              </thead>
              <tbody>
                {currentProducts.map((product) => (
                  <tr
                    key={product.id}
                    style={{
                      backgroundColor: product.isActive ? (product.quantity > 0 ? '#fff' : '#dfdfdf') : '#f8d7da',
                    }}
                  >
                    <td className="td-status">
                      <span
                        style={{
                          backgroundColor: product.isActive ? (product.quantity > 0 ? '#fff' : '#dfdfdf') : '#f8d7da',
                        }}
                        className={`td__isActive td__isActive--${product.isActive ? (product.quantity > 0 ? 'false' : 'true') : 'true'}`}
                      >
                        {product.isActive ? (product.quantity > 0 ? 'Đang bán' : 'Hết hàng') : 'Ngừng bán'}
                      </span>
                    </td>
                    <td className="td-img">
                      <img
                        src={product.images[1]?.url || 'https://sonnptnt.thaibinh.gov.vn/App/images/no-image-news.png'}
                        alt={product.name}
                        className="admin__image-preview admin__image-preview--product"
                      />
                    </td>
                    <td className="td-name">{product.name}</td>
                    <td className="td-description">{product.description}</td>
                    <td className="td-category">{product._idCategory?.name}</td>
                    <td>{product.quantity}</td>
                    <td>{product.unit}</td>
                    <td>{product.price} VND</td>
                    <td>{product.discount}%</td>
                    <td className="td-option">
                      <button
                        className="admin__action-btn admin__action-btn--view"
                        onClick={() => handleViewProduct(product._id, product.isActive)}
                        disabled={loading}
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                      <button
                        className="admin__action-btn admin__action-btn--edit"
                        onClick={() => handleEditProduct(product._id)}
                        disabled={loading}
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        className="admin__action-btn admin__action-btn--delete"
                        onClick={() => handleDeleteProduct(product._id)}
                        disabled={loading}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(page) => setCurrentPage(page)} />
        </>
      )}

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setIdProdDel(null);
        }}
        onConfirm={confirmDeleteProduct}
        title="Xóa sản phẩm"
        message={idProdDel ? `Bạn có chắc chắn muốn xóa sản phẩm này"${idProdDel.name}"?` : ''}
      />
    </section>
  );
};

export default Products;
