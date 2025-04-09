import moment from 'moment';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';

import Modal from '@components/common/Modal';
import Pagination from '@components/common/Pagination';
import { getCategoriesAll, editCategory, deleteCategory } from '@services/CategoryService';
import { loginSuccess } from '@/redux/authSlice.jsx';
import { createAxios } from '@utils/createInstance.jsx';

const Categories = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [idCateDel, setIdCateDel] = useState(null);
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
        setCategories(
          data.map((cat) => ({
            ...cat,
            name: cat.name || '',
            description: cat.description || '',
            status: cat.status || 'inactive',
          })),
        );
      } catch {
        setError('Không thể tải danh mục. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const newCategory = state?.newCategory;
    if (newCategory && !categories.some((cat) => cat.id === newCategory.id)) {
      setCategories((prev) => [...prev, newCategory]);
    }
  }, [state, categories]);

  const handleViewCategory = async (id, status) => {
    try {
      const newStatus = status === 'active' ? 'inactive' : 'active';
      await editCategory(id, { status: newStatus }, accessToken, axiosJWT);
      setCategories((prev) => prev.map((cat) => (cat._id === id ? { ...cat, status: newStatus } : cat)));

      const activeCategories = categories.filter((cat) => cat.status === 'active');
      const newTotalPages = Math.ceil(activeCategories.length / itemsPerPage);
      if (currentPage > newTotalPages) {
        setCurrentPage(Math.max(1, newTotalPages));
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái:', error);
    }
  };

  const handleDeleteCategory = (id) => {
    setIdCateDel(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteCategory = async () => {
    setLoading(true);
    console.log(idCateDel);
    try {
      await deleteCategory(idCateDel, accessToken, axiosJWT);
      setCategories((prev) => prev.filter((cat) => cat._id !== idCateDel));

      const activeCategories = categories.filter((cat) => cat.status === 'active');
      const newTotalPages = Math.ceil(activeCategories.length / itemsPerPage);
      if (currentPage > newTotalPages) {
        setCurrentPage(Math.max(1, newTotalPages));
      }
    } catch (err) {
      console.error('Lỗi khi xóa danh mục:', err);
    } finally {
      setIsDeleteModalOpen(false);
      setIdCateDel(null);
      setLoading(false);
    }
  };

  const handleEditCategory = (id) => navigate(`/admin/categories/edit/${id}`);
  const handleAddCategory = () => navigate('/admin/categories/add');

  const filteredCategories = categories.filter(
    (cat) => cat.status === 'active' && (cat.name || '').toLowerCase().includes(searchTerm.toLowerCase()),
  );
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const currentCategories = filteredCategories.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const formatDate = (isoDate) => moment(isoDate).format('DD/MM/YYYY HH:mm:ss');

  if (error) return <div>{error}</div>;

  return (
    <section className="admin__section">
      <div className="admin__section-header">
        <h2 className="admin__section-title">All Category ({filteredCategories.length})</h2>
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
                {currentCategories.map((category) => (
                  <tr key={category._id}>
                    <td className="td-name">{category.name || 'Không có tên'}</td>
                    <td className="td-name">{category.description || 'Không có mô tả'}</td>
                    <td className="td-date">{formatDate(category.createdAt)}</td>
                    <td className="td-img">
                      <img
                        src={`${urlImage}${category.image}`}
                        alt={`${category.name || 'Danh mục'} : ${category.description || 'Không có mô tả'}`}
                        className="admin__image-preview admin__image-preview--category"
                      />
                    </td>
                    <td className="td-slug">{category.slug || 'Không có slug'}</td>
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
                        onClick={() => handleDeleteCategory(category._id)}
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
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </>
      )}

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setIdCateDel(null);
        }}
        onConfirm={confirmDeleteCategory}
        title="Xóa danh mục"
        message={idCateDel ? 'Bạn có chắc chắn muốn xóa danh mục này?' : ''}
      />
    </section>
  );
};

export default Categories;
