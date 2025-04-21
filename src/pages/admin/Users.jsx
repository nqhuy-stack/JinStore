import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '@components/common/Modal';
import Pagination from '@components/common/Pagination';
import { getAllUsers } from '@services/UserService';
import { useDispatch, useSelector } from 'react-redux';
import { createAxios } from '@utils/createInstance.jsx';
import { loginSuccess } from '@/redux/authSlice.jsx';

const Users = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.login.currentUser);
  const accessToken = user?.accessToken;
  const axiosJWT = createAxios(user, dispatch, loginSuccess);

  const [users, setUsers] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // ✅ Fetch users only once
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAllUsers(accessToken, axiosJWT);
        if (data && Array.isArray(data)) {
          setUsers(
            data.map((user) => ({
              ...user,
              fullname: user.fullname || 'Member...',
              phone: user.phone || '',
              email: user.email || '',
              address: user.address || '',
              dateBirth: user.dateBirth || 'dd/mm/yyyy',
              sex: user.sex || 'Giói tính...',
              createdAt: user.createdAt || '',
              updatedAt: user.updatedAt || '',
              isAdmin: user.isAdmin || '',
              isActive: user.isActive || '',
              avatar: user.avatar || 'https://sonnptnt.thaibinh.gov.vn/App/images/no-image-news.png',
            })),
          );
        } else {
          setError('Dữ liệu người dùng không hợp lệ');
        }
      } catch {
        setError('Không thể tải danh sách người dùng. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleViewUser = (id) => navigate(`/admin/users/view/${id}`);
  const handleEditUser = (id) => navigate(`/admin/users/edit/${id}`);

  const handleDeleteUser = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteUser = () => {
    setLoading(true);
    setTimeout(() => {
      setUsers((prevUsers) => prevUsers.filter((u) => u.id !== userToDelete.id));
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
      setLoading(false);
    }, 500);
  };

  const handleAddUser = () => navigate('/admin/users/add');

  // ✅ Tìm kiếm user theo name hoặc email
  const filteredUsers = users.filter((user) => user.fullname?.toLowerCase().includes(searchTerm.toLowerCase()));

  const totalItems = filteredUsers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  return (
    <section className="admin__section">
      <div className="admin__section-header">
        <h2 className="admin__section-title">All Users</h2>
        <button className="admin__add-button" onClick={handleAddUser}>
          + Add New
        </button>
      </div>

      <div className="admin__search-bar">
        <input
          type="text"
          placeholder="Search by Name or Email..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // reset về trang đầu khi tìm kiếm
          }}
        />
      </div>

      {loading ? (
        <p>Đang tải...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          <div className="admin__table-wrapper">
            <table className="admin__table block__table">
              <thead>
                <tr>
                  <th>Avatar</th>
                  <th>Full name</th>
                  <th>Giới tính</th>
                  <th>Ngày sinh</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Loại dăng nhập</th>
                  <th>Vai trò</th>
                  <th>Trang thái</th>
                  <th>Option</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <img
                        src={`${user.avatar}`}
                        alt={user.fullname}
                        className="admin__image-preview admin__image-preview--user"
                      />
                    </td>
                    <td>{user.fullname}</td>
                    <td>{user.sex}</td>
                    <td>{user.dateBirth}</td>
                    <td>{user.phone || 'N/A'}</td>
                    <td>{user.email}</td>
                    <td>{user.authProvider}</td>
                    <td>{user.isAdmin ? 'Admin' : 'Member'}</td>
                    <td>{user.isActive ? 'Hoạt động' : 'Khóa'}</td>
                    <td>
                      <button
                        className="admin__action-btn admin__action-btn--view"
                        onClick={() => handleViewUser(user.id)}
                        disabled={loading}
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                      <button
                        className="admin__action-btn admin__action-btn--edit"
                        onClick={() => handleEditUser(user.id)}
                        disabled={loading}
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        className="admin__action-btn admin__action-btn--delete"
                        onClick={() => handleDeleteUser(user)}
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
          setUserToDelete(null);
        }}
        onConfirm={confirmDeleteUser}
        title="Confirm Delete User"
        message={userToDelete ? `Are you sure you want to delete user "${userToDelete.name}"?` : ''}
      />
    </section>
  );
};

export default Users;
