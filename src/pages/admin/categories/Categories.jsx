import moment from 'moment';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Modal from '@components/common/ui/Modal';
import Pagination from '@components/common/ui/Pagination';
import { getCategoriesAll, editCategory, deleteCategory } from '@services/CategoryService';
import { loginSuccess } from '@/redux/authSlice.jsx';
import { createAxios } from '@utils/createInstance.jsx';
import PageLoad from '@pages/PageLoad';

const Categories = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [originalCategories, setOriginalCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [idCateDel, setIdCateDel] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const user = useSelector((state) => state.auth.login.currentUser);
  const accessToken = user?.accessToken;
  const axiosJWT = createAxios(user, dispatch, loginSuccess);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log('🔍 Starting to fetch categories...');
        setLoading(true);
        setError(null);

        const data = await getCategoriesAll();
        console.log(`✅ Fetched ${data.length} categories`);
        setOriginalCategories(data);
        if (data && Array.isArray(data)) {
          setCategories(
            data.map((cat) => ({
              ...cat,
              name: cat.name || '',
              description: cat.description || '',
              status: cat.status || 'inactive',
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

  //NOTE: Handle filter
  const handleFilter = (e) => {
    const status = e.target.value;
    if (status === 'all') {
      setCategories(originalCategories); // Hiển thị tất cả danh mục
    } else {
      const filteredCategories = originalCategories.filter((category) => category.status === status);
      setCategories(filteredCategories);
    }
    setCurrentPage(1); // Reset to first page
  };
  //NOTE: Handle View
  const handleViewCategory = async (id, status) => {
    try {
      console.log(`👁️ Toggling category status: ${id} from ${status}`);

      const newStatus = status === 'active' ? 'inactive' : 'active';
      await editCategory(id, { status: newStatus }, accessToken, axiosJWT);
      setCategories((prev) => prev.map((cat) => (cat._id === id ? { ...cat, status: newStatus } : cat)));
      setOriginalCategories((prev) => prev.map((cat) => (cat._id === id ? { ...cat, status: newStatus } : cat)));

      const activeCategories = categories.filter((cat) => cat.status === 'active');
      const newTotalPages = Math.ceil(activeCategories.length / itemsPerPage);
      if (currentPage > newTotalPages) {
        setCurrentPage(Math.max(1, newTotalPages));
      }
    } catch (error) {
      console.error('❌ Lỗi khi cập nhật trạng thái:', error);
    }
  };
  //NOTE: Handle Delete
  const handleDeleteCategory = (id) => {
    console.log(`🗑️ Opening delete modal for category: ${id}`);

    setIdCateDel(id);
    setIsDeleteModalOpen(true);
  };
  //NOTE: Confirm Delete
  const confirmDeleteCategory = async () => {
    setLoading(true);

    console.log(`🗑️ Deleting category: ${idCateDel}`);

    try {
      await deleteCategory(idCateDel, accessToken, axiosJWT);
      setCategories((prev) => prev.filter((cat) => cat._id !== idCateDel));
      setOriginalCategories((prev) => prev.filter((cat) => cat._id !== idCateDel));

      const activeCategories = categories.filter((cat) => cat.status === 'active');
      const newTotalPages = Math.ceil(activeCategories.length / itemsPerPage);
      if (currentPage > newTotalPages) {
        setCurrentPage(Math.max(1, newTotalPages));
      }
    } catch (err) {
      console.error('❌ Lỗi khi xóa danh mục:', err);
    } finally {
      setIsDeleteModalOpen(false);
      setIdCateDel(null);
      setLoading(false);
    }
  };
  //NOTE: Handle Edit
  const handleEditCategory = (id) => {
    console.log(`✏️ Navigating to edit category: ${id}`);
    navigate(`/admin/categories/edit/${id}`);
  };
  //NOTE: Handle Add
  const handleAddCategory = () => {
    console.log('➕ Navigating to add new category');
    navigate('/admin/categories/add');
  };

  const totalPages = Math.ceil(categories.length / itemsPerPage);
  const currentCategories = categories.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const formatDate = (isoDate) => moment(isoDate).format('DD/MM/YYYY HH:mm:ss');

  if (error) return <div className="error-message">{error}</div>;

  return (
    <section className="admin__section">
      <div className="admin__section-header">
        <h2 className="admin__section-title">All Category ({categories.length})</h2>
        <button className="admin__add-button" onClick={handleAddCategory}>
          + Add New
        </button>
      </div>
      <div className="admin__search-bar">
        <select className="custom-select select__filter-status" onChange={handleFilter}>
          <option value="all">Tất cả</option>
          <option value="active">Đang bán</option>
          <option value="inactive">Ngừng bán</option>
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
                  <th className="th-status">Tình trạng</th>
                  <th className="th-name">Code</th>
                  <th className="th-name">Tên</th>
                  <th className="th-description">Mô tả</th>
                  <th className="th-date">Ngày Thêm</th>
                  <th className="th-img">Ảnh</th>
                  <th className="th-slug">Slug</th>
                  <th className="th-outstanding">Trạng thái</th>
                  <th className="th-option">Tùy chỉnh</th>
                </tr>
              </thead>
              <tbody>
                {currentCategories.map((category) => (
                  <tr
                    key={category._id}
                    style={{ backgroundColor: category.status === 'inactive' ? '#f8d7da' : '#fff' }}
                  >
                    <td className="td-status">
                      {' '}
                      <span className={`td__status td__status--${category.status === 'inactive' ? 'true' : 'false'}`}>
                        {category.status === 'active' ? 'Đang bán' : 'Ngừng bán'}
                      </span>
                    </td>
                    <td className="td-code">{category.code}</td>
                    <td className="td-name">{category.name || 'Không có tên'}</td>
                    <td className="td-description">{category.description || 'Không có mô tả'}</td>
                    <td className="td-date">{formatDate(category.createdAt)}</td>
                    <td className="td-img">
                      <img
                        src={category.image?.url || '/placeholder-image.jpg'}
                        alt={`${category.name || 'Danh mục'} : ${category.description || 'Không có mô tả'}`}
                        className="admin__image-preview admin__image-preview--category"
                      />
                    </td>
                    <td className="td-slug">{category.slug || 'Không có slug'}</td>
                    <td className="td-outstanding">
                      <span className={`td__outstanding td__outstanding--${category.isOutstanding ? 'true' : 'false'}`}>
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
