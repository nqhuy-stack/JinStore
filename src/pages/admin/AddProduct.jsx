import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '@components/ui/Modal';

const AddProduct = () => {
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    discount: '',
    stock: '',
    categoryID: '',
    images: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    if (!newProduct.name.trim()) return 'Tên sản phẩm không được để trống.';
    if (!newProduct.price || newProduct.price <= 0) return 'Giá phải lớn hơn 0.';
    return null;
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setIsAddModalOpen(true);
      setLoading(false);
    }, 500);
  };

  const confirmAddProduct = () => {
    setLoading(true);
    setTimeout(() => {
      console.log('Added product:', newProduct);
      setNewProduct({ name: '', description: '', price: '', discount: '', stock: '', categoryID: '', images: [] });
      setIsAddModalOpen(false);
      setLoading(false);
      navigate('/admin/products');
    }, 500);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const imageURLs = files.map((file) => URL.createObjectURL(file));
    setNewProduct((prev) => ({ ...prev, images: [...prev.images, ...imageURLs] }));
  };

  const removeImagePreview = (indexToRemove) => {
    setNewProduct((prev) => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove),
    }));
  };

  return (
    <section className="admin__section">
      <h2 className="admin__section-title">Add New Product</h2>
      {error && <p className="error-message">{error}</p>}
      <form className="admin__form" onSubmit={handleAddProduct}>
        <div className="admin__form-row">
          <div className="admin__form-field">
            <label htmlFor="product-name">Product Name</label>
            <input
              type="text"
              id="product-name"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              required
            />
          </div>
          <div className="admin__form-field">
            <label htmlFor="product-description">Description</label>
            <textarea
              id="product-description"
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
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
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
              required
              step="0.01"
            />
          </div>
          <div className="admin__form-field">
            <label htmlFor="product-discount">Discount (%)</label>
            <input
              type="number"
              id="product-discount"
              value={newProduct.discount}
              onChange={(e) => setNewProduct({ ...newProduct, discount: e.target.value })}
              required
              step="0.01"
            />
          </div>
          <div className="admin__form-field">
            <label htmlFor="product-stock">Stock</label>
            <input
              type="number"
              id="product-stock"
              value={newProduct.stock}
              onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
              required
            />
          </div>
          <div className="admin__form-field">
            <label htmlFor="product-category">Category ID</label>
            <input
              type="number"
              id="product-category"
              value={newProduct.categoryID}
              onChange={(e) => setNewProduct({ ...newProduct, categoryID: e.target.value })}
              required
            />
          </div>
        </div>
        <div className="admin__form-row">
          <div className="admin__form-field">
            <label htmlFor="product-images">Images</label>
            <input type="file" id="product-images" accept="image/*" multiple onChange={handleImageChange} />
            {newProduct.images.length > 0 && (
              <div className="image-preview-container">
                {newProduct.images.map((image, index) => (
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
          {loading ? 'Adding...' : 'Add Product'}
        </button>
      </form>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onConfirm={confirmAddProduct}
        title="Confirm Add Product"
        message={`Are you sure you want to add "${newProduct.name}"?`}
      />
    </section>
  );
};

export default AddProduct;
