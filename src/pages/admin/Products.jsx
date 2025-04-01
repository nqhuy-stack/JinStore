// File: src/pages/admin/Products.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '@components/ui/Modal';
import Pagination from '@components/ui/Pagination'; // Thêm import

const Products = () => {
  const [products, setProducts] = useState([
    // Dữ liệu giả lập (tăng số lượng để minh họa phân trang)
    { id: 1, name: 'Aata Buscut', category: 'Buscut', qty: 100, price: 10, status: 'Approved' },
    { id: 2, name: 'Cold Brew Coffee', category: 'Coffee', qty: 50, price: 15, status: 'Pending' },
    // ... Thêm nhiều sản phẩm hơn (giả lập 50 sản phẩm)
    ...Array.from({ length: 48 }, (_, i) => ({
      id: i + 3,
      name: `Product ${i + 3}`,
      category: 'Category',
      qty: Math.floor(Math.random() * 100),
      price: Math.floor(Math.random() * 50),
      status: Math.random() > 0.5 ? 'Approved' : 'Pending',
    })),
  ]);
  const [loading, setLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1); // Thêm state cho trang hiện tại
  const itemsPerPage = 10; // Số mục trên mỗi trang
  const navigate = useNavigate();

  const handleViewProduct = (id) => {
    navigate(`/admin/products/view/${id}`);
  };

  const handleEditProduct = (id) => {
    navigate(`/admin/products/edit/${id}`);
  };

  const handleDeleteProduct = (product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteProduct = () => {
    setLoading(true);
    setTimeout(() => {
      setProducts(products.filter((p) => p.id !== productToDelete.id));
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
      setLoading(false);
    }, 500);
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
        <input
          type="text"
          placeholder="Search by Product Name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <>
          <div className="admin__table-wrapper">
            <table className="admin__table">
              <thead>
                <tr>
                  <th>Product Image</th>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Current Qty</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Option</th>
                </tr>
              </thead>
              <tbody>
                {currentProducts.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <img
                        src="https://via.placeholder.com/100"
                        alt={product.name}
                        className="admin__image-preview admin__image-preview--product"
                      />
                    </td>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td>{product.qty}</td>
                    <td>${product.price}</td>
                    <td>
                      <span
                        className={`admin__status admin__status--${
                          product.status.toLowerCase() === 'approved' ? 'approved' : 'pending'
                        }`}
                      >
                        {product.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="admin__action-btn admin__action-btn--view"
                        onClick={() => handleViewProduct(product.id)}
                        disabled={loading}
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                      <button
                        className="admin__action-btn admin__action-btn--edit"
                        onClick={() => handleEditProduct(product.id)}
                        disabled={loading}
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        className="admin__action-btn admin__action-btn--delete"
                        onClick={() => handleDeleteProduct(product)}
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
          setProductToDelete(null);
        }}
        onConfirm={confirmDeleteProduct}
        title="Confirm Delete Product"
        message={productToDelete ? `Are you sure you want to delete product "${productToDelete.name}"?` : ''}
      />
    </section>
  );
};

export default Products;
