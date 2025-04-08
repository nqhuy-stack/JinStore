// File: src/pages/admin/AddCategory.jsx
import slugify from 'slugify';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess } from '@/redux/authSlice.jsx';
import { addCategories } from '@services/CategoryService.jsx';
import { createAxios } from '@utils/createInstance.jsx';

const AddCategory = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.login.currentUser);
  const accessToken = user?.accessToken;
  const axiosJWT = createAxios(user, dispatch, loginSuccess);
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');

  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    console.log(file.name);
    if (file) {
      setImage(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImage(null);
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newCategory = {
      name: name.trim(),
      image: image || '',
      description: description.trim(),
    };

    await addCategories(newCategory, dispatch, accessToken, axiosJWT);
    navigate('/admin/categories');
  };

  return (
    <section className="admin__section">
      <h2 className="admin__section-title">Add New Category</h2>
      <form className="admin__form" onSubmit={handleSubmit}>
        <div className="admin__form-row">
          {/* NOTE: Name */}
          <div className="admin__form-field">
            <label htmlFor="name">Category Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter category name"
              required
            />
          </div>
          {/* NOTE: Slug */}
          <div className="admin__form-field">
            <label htmlFor="slug">Slug (chỉ mang tính chất tham khảo)</label>
            <input
              type="text"
              value={slugify(name, { lower: true, strict: true })}
              readOnly
              style={{
                backgroundColor: '#f3f4f6',
                color: '#6b7280',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                width: '100%',
                cursor: 'default',
              }}
            />
          </div>
        </div>
        <div className="admin__form-row">
          {/* NOTE: Image */}
          <div className="admin__form-field">
            <label htmlFor="image">Category Image</label>
            <input
              type="file"
              className="input__image"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
            />
            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="admin__image-preview admin__image-preview--category" />
            )}
          </div>
          {/* NOTE: Description */}
          <div className="admin__form-field">
            <label htmlFor="description">Description *</label>
            <textarea name="description" onChange={(e) => setDescription(e.target.value)}></textarea>
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
