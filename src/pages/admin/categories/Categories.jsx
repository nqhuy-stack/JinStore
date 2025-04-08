import moment from 'moment';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';

import Modal from '@components/common/Modal';
import Pagination from '@components/common/Pagination';
import { getCategoriesAll } from '@services/CategoryService.jsx';
import { editStatus } from '@services/CategoryService';
import { loginSuccess } from '@/redux/authSlice.jsx';
import { createAxios } from '@utils/createInstance.jsx';

const Categories = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Lấy dữ liệu category mới từ state (nếu có)
  const newCategory = location.state?.newCategory;
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const user = useSelector((state) => state.auth.login.currentUser);
  const accessToken = user?.accessToken;
  const axiosJWT = createAxios(user, dispatch, loginSuccess);

  const itemsPerPage = 10;
  const urlImage = '../src/assets/images/categories/';

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await getCategoriesAll();
        setCategories(data);
      } catch (error) {
        setError('Không thể tải danh mục. Vui lòng thử lại sau.');
        console.error('Lỗi khi lấy danh mục:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (error) return <div>{error}</div>;

  // Thêm category mới vào danh sách nếu có
  if (newCategory && !categories.some((cat) => cat.id === newCategory.id)) {
    setCategories((prev) => [...prev, newCategory]);
  }

  const handleViewCategory = async (id, status) => {
    const newStatus = status === 'active' ? 'inactive' : 'active';
    await editStatus(id, newStatus, accessToken, axiosJWT);
    // Cập nhật state categories ngay lập tức
    setCategories((prevCategories) =>
      prevCategories.map((category) => (category._id === id ? { ...category, status: newStatus } : category)),
    );

    // Kiểm tra và cập nhật currentPage nếu cần
    const updatedCategories = categories.map((category) =>
      category._id === id ? { ...category, status: newStatus } : category,
    );
    const activeCategories = updatedCategories.filter((category) => category.status === 'active');
    const newTotalPages = Math.ceil(activeCategories.length / itemsPerPage);

    if (currentPage > newTotalPages) {
      setCurrentPage(Math.max(1, newTotalPages));
    }
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

  const filteredCategories = categories.filter(
    (category) => category.status === 'active' && category.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  const formatDate = (isoDate) => moment(isoDate).format('DD/MM/YYYY HH:mm:ss');

  //NOTE: Panigation
  const totalItems = filteredCategories.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCategories = filteredCategories.slice(startIndex, endIndex);

  return (
    <section className="admin__section">
      <div className="admin__section-header">
        <h2 className="admin__section-title">
          All Category ({categories.filter((category) => category.status === 'active').length})
        </h2>
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
                  <th className="th-nam">Product Name</th>
                  <th className="th-nam">Description</th>
                  <th className="th-date">Date</th>
                  <th className="th-img">Image</th>
                  <th className="th-slug">Slug</th>
                  <th className="th-outstanding">Outstanding</th>
                  <th className="th-option">Option</th>
                </tr>
              </thead>
              <tbody>
                {currentCategories.map(
                  (category) =>
                    category.status === 'active' && (
                      <tr key={category._id}>
                        <td className="td-name">{category.name}</td>
                        <td className="td-name">{category.description}</td>
                        <td className="td-date">{formatDate(category.createdAt)}</td>
                        <td className="td-img">
                          <img
                            src={`${urlImage}${category.image}`}
                            alt={`${category.name} : ${category.description}`}
                            className="admin__image-preview admin__image-preview--category"
                          />
                        </td>
                        <td className="td-slug">{category.slug}</td>
                        <td className="td-outstanding">
                          <span
                            className={`td__outstanding ${category.isOutstanding ? 'td__outstanding--true' : 'td__outstanding--false'}`}
                          >
                            {category.isOutstanding ? 'Nổi bật' : 'Bình thường'}
                          </span>
                        </td>
                        <td className="td-option">
                          <button
                            className="admin__action-btn admin__action-btn--view"
                            onClick={() => handleViewCategory(category._id, category.status)}
                            disabled={loading}
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                          <button
                            className="admin__action-btn admin__action-btn--edit"
                            onClick={() => handleEditCategory(category._id)}
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
                    ),
                )}
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
