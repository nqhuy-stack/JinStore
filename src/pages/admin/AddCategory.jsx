// File: src/pages/admin/AddCategory.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddCategory = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    icon: 'fas fa-folder', // Giá trị mặc định
    image: null,
    slug: '',
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Tự động tạo slug từ tên category
    if (name === 'name') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-') // Thay thế ký tự không phải chữ/số bằng dấu gạch ngang
        .replace(/(^-|-$)/g, ''); // Xóa dấu gạch ngang ở đầu/cuối
      setFormData((prev) => ({
        ...prev,
        slug: slug,
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Kiểm tra dữ liệu
    if (!formData.name || !formData.slug) {
      setError('Please fill in all required fields (Name and Slug).');
      return;
    }

    // Giả lập lưu category mới (thay bằng API call trong thực tế)
    const newCategory = {
      id: Date.now(), // ID tạm thời
      name: formData.name,
      date: new Date().toLocaleDateString('en-GB'), // Định dạng ngày: DD-MM-YYYY
      image: imagePreview || 'https://via.placeholder.com/100', // Sử dụng ảnh preview hoặc ảnh mặc định
      icon: formData.icon,
      slug: formData.slug,
    };

    console.log('New Category:', newCategory); // Log để kiểm tra

    // Điều hướng về trang danh sách categories
    navigate('/admin/categories');
  };

  return (
    <section className="admin__section">
      <h2 className="admin__section-title">Add New Category</h2>
      {error && <p className="error-message">{error}</p>}
      <form className="admin__form" onSubmit={handleSubmit}>
        <div className="admin__form-row">
          <div className="admin__form-field">
            <label htmlFor="name">Category Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter category name"
              required
            />
          </div>
          <div className="admin__form-field">
            <label htmlFor="slug">Slug *</label>
            <input
              type="text"
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleInputChange}
              placeholder="Enter slug"
              required
            />
          </div>
        </div>
        <div className="admin__form-row">
          <div className="admin__form-field">
            <label htmlFor="icon">Icon</label>
            <select id="icon" name="icon" value={formData.icon} onChange={handleInputChange}>
              <option value="fas fa-folder">Folder (Default)</option>
              <option value="fas fa-carrot">Carrot</option>
              <option value="fas fa-coffee">Coffee</option>
              <option value="fas fa-bread-slice">Bread</option>
              <option value="fas fa-snowflake">Snowflake</option>
              <option value="fas fa-paw">Paw</option>
            </select>
          </div>
          <div className="admin__form-field">
            <label htmlFor="image">Category Image</label>
            <input type="file" id="image" name="image" accept="image/*" onChange={handleImageChange} />
            {imagePreview && <img src={imagePreview} alt="Preview" className="admin__image-preview" />}
          </div>
        </div>
        <button type="submit" className="admin__form-button">
          Add Category
        </button>
      </form>
    </section>
  );
};

export default AddCategory;
