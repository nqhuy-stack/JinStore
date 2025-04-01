// File: src/pages/admin/Categories.jsx
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Modal from '@components/ui/Modal';
import Pagination from '@components/ui/Pagination';

const Categories = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Lấy dữ liệu category mới từ state (nếu có)
  const newCategory = location.state?.newCategory;

  const [categories, setCategories] = useState([
    {
      id: 1,
      name: 'Aata Buscut',
      date: '26-12-2021',
      image: 'https://via.placeholder.com/100',
      icon: 'fas fa-carrot',
      slug: 'buscut',
    },
    {
      id: 2,
      name: 'Cold Brew Coffee',
      date: '21-05-2022',
      image: 'https://via.placeholder.com/100',
      icon: 'fas fa-coffee',
      slug: 'coffee',
    },
    ...Array.from({ length: 48 }, (_, i) => ({
      id: i + 3,
      name: `Category ${i + 3}`,
      date: '20-08-2022',
      image: 'https://via.placeholder.com/100',
      icon: 'fas fa-folder',
      slug: `category-${i + 3}`,
    })),
  ]);
  const [loading, setLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Thêm category mới vào danh sách nếu có
  if (newCategory && !categories.some((cat) => cat.id === newCategory.id)) {
    setCategories((prev) => [...prev, newCategory]);
  }

  const handleViewCategory = (id) => {
    navigate(`/admin/categories/view/${id}`);
  };

  const handleEditCategory = (id) => {
    navigate(`/admin/categories/edit/${id}`);
  };

  const handleDeleteCategory = (category) => {
    setCategoryToDelete(category);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteCategory = () => {
    setLoading(true);
    setTimeout(() => {
      setCategories(categories.filter((c) => c.id !== categoryToDelete.id));
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
      setLoading(false);
    }, 500);
  };

  const handleAddCategory = () => {
    navigate('/admin/categories/add');
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalItems = filteredCategories.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCategories = filteredCategories.slice(startIndex, endIndex);

  return (
    <section className="admin__section">
      <div className="admin__section-header">
        <h2 className="admin__section-title">All Category</h2>
        <button className="admin__add-button" onClick={handleAddCategory}>
          + Add New
        </button>
      </div>
      <div className="admin__search-bar">
        <input
          type="text"
          placeholder="Search by Category Name..."
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
                  <th>Product Name</th>
                  <th>Date</th>
                  <th>Product Image</th>
                  <th>Icon</th>
                  <th>Slug</th>
                  <th>Option</th>
                </tr>
              </thead>
              <tbody>
                {currentCategories.map((category) => (
                  <tr key={category.id}>
                    <td>{category.name}</td>
                    <td>{category.date}</td>
                    <td>
                      <img
                        src={category.image}
                        alt={category.name}
                        className="admin__image-preview admin__image-preview--category"
                      />
                    </td>
                    <td>
                      <i className={category.icon}></i>
                    </td>
                    <td>{category.slug}</td>
                    <td>
                      <button
                        className="admin__action-btn admin__action-btn--view"
                        onClick={() => handleViewCategory(category.id)}
                        disabled={loading}
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                      <button
                        className="admin__action-btn admin__action-btn--edit"
                        onClick={() => handleEditCategory(category.id)}
                        disabled={loading}
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        className="admin__action-btn admin__action-btn--delete"
                        onClick={() => handleDeleteCategory(category)}
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
          setCategoryToDelete(null);
        }}
        onConfirm={confirmDeleteCategory}
        title="Confirm Delete Category"
        message={categoryToDelete ? `Are you sure you want to delete category "${categoryToDelete.name}"?` : ''}
      />
    </section>
  );
};

export default Categories;
