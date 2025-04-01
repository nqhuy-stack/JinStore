import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Modal from '@components/ui/Modal';

const EditProduct = () => {
  const { id } = useParams(); // Lấy ID từ URL
  const navigate = useNavigate();

  // Giả lập dữ liệu sản phẩm (sau này thay bằng API hoặc state từ Redux)
  const initialProducts = [
    {
      id: 1,
      name: 'Product 1',
      description: 'Description 1',
      price: 10.99,
      discount: 5,
      stock: 100,
      categoryID: 1,
      images: ['https://via.placeholder.com/100'],
    },
    {
      id: 2,
      name: 'Product 2',
      description: 'Description 2',
      price: 15.99,
      discount: 10,
      stock: 50,
      categoryID: 2,
      images: ['https://via.placeholder.com/100'],
    },
  ];

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    // Tìm sản phẩm theo ID (giả lập)
    const foundProduct = initialProducts.find((p) => p.id === parseInt(id));
    if (foundProduct) {
      setProduct({ ...foundProduct });
    } else {
      setError('Product not found');
    }
  }, [id]);

  const validateForm = () => {
    if (!product.name.trim()) return 'Tên sản phẩm không được để trống.';
    if (!product.price || product.price <= 0) return 'Giá phải lớn hơn 0.';
    return null;
  };

  const handleEditProduct = (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setIsEditModalOpen(true);
      setLoading(false);
    }, 500);
  };

  const confirmEditProduct = () => {
    setLoading(true);
    setTimeout(() => {
      console.log('Edited product:', product); // Thay bằng logic cập nhật state/API
      setIsEditModalOpen(false);
      setLoading(false);
      navigate('/admin/products'); // Quay lại trang danh sách
    }, 500);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const imageURLs = files.map((file) => URL.createObjectURL(file));
    setProduct((prev) => ({ ...prev, images: [...prev.images, ...imageURLs] }));
  };

  const removeImagePreview = (indexToRemove) => {
    setProduct((prev) => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove),
    }));
  };

  if (!product) {
    return <p>{error || 'Loading...'}</p>;
  }

  return (
    <section className="admin__section">
      <h2 className="admin__section-title">Edit Product (ID: {id})</h2>
      {error && <p className="error-message">{error}</p>}
      <form className="admin__form" onSubmit={handleEditProduct}>
        <div className="admin__form-row">
          <div className="admin__form-field">
            <label htmlFor="product-name">Product Name</label>
            <input
              type="text"
              id="product-name"
              value={product.name}
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
              required
            />
          </div>
          <div className="admin__form-field">
            <label htmlFor="product-description">Description</label>
            <textarea
              id="product-description"
              value={product.description}
              onChange={(e) => setProduct({ ...product, description: e.target.value })}
              required
            />
          </div>
        </div>
        <div className="admin__form-row">
          <div className="admin__form-field">
            <label htmlFor="product-price">Price ($)</label>
            <input
              type="number"
              id="product-price"
              value={product.price}
              onChange={(e) => setProduct({ ...product, price: e.target.value })}
              required
              step="0.01"
            />
          </div>
          <div className="admin__form-field">
            <label htmlFor="product-discount">Discount (%)</label>
            <input
              type="number"
              id="product-discount"
              value={product.discount}
              onChange={(e) => setProduct({ ...product, discount: e.target.value })}
              required
              step="0.01"
            />
          </div>
          <div className="admin__form-field">
            <label htmlFor="product-stock">Stock</label>
            <input
              type="number"
              id="product-stock"
              value={product.stock}
              onChange={(e) => setProduct({ ...product, stock: e.target.value })}
              required
            />
          </div>
          <div className="admin__form-field">
            <label htmlFor="product-category">Category ID</label>
            <input
              type="number"
              id="product-category"
              value={product.categoryID}
              onChange={(e) => setProduct({ ...product, categoryID: e.target.value })}
              required
            />
          </div>
        </div>
        <div className="admin__form-row">
          <div className="admin__form-field">
            <label htmlFor="product-images">Images</label>
            <input type="file" id="product-images" accept="image/*" multiple onChange={handleImageChange} />
            {product.images.length > 0 && (
              <div className="image-preview-container">
                {product.images.map((image, index) => (
                  <div key={index} className="image-preview-item">
                    <img src={image} alt={`Preview ${index + 1}`} className="admin__image-preview" />
                    <button type="button" className="image-preview-remove" onClick={() => removeImagePreview(index)}>
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <button type="submit" className="admin__form-button" disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onConfirm={confirmEditProduct}
        title="Confirm Edit Product"
        message={`Are you sure you want to save changes to "${product.name}"?`}
      />
    </section>
  );
};

export default EditProduct;
