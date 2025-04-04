// File: src/pages/admin/Users.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '@components/ui/Modal';
import Pagination from '@components/ui/Pagination'; // Thêm import

const Users = () => {
  const [users, setUsers] = useState([
    // Dữ liệu giả lập (tăng số lượng để minh họa phân trang)
    {
      id: 1,
      name: 'John Doe',
      phone: '123-456-7890',
      email: 'john.doe@example.com',
    },
    {
      id: 2,
      name: 'Jane Smith',
      phone: '098-765-4321',
      email: 'jane.smith@example.com',
    },
    // ... Thêm nhiều người dùng hơn (giả lập 50 người dùng)
    ...Array.from({ length: 48 }, (_, i) => ({
      id: i + 3,
      name: `User ${i + 3}`,
      phone: `123-456-78${i + 10}`,
      email: `user${i + 3}@example.com`,
    })),
  ]);
  const [loading, setLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1); // Thêm state cho trang hiện tại
  const itemsPerPage = 10; // Số mục trên mỗi trang
  const navigate = useNavigate();

  const handleViewUser = (id) => {
    navigate(`/admin/users/view/${id}`);
  };

  const handleEditUser = (id) => {
    navigate(`/admin/users/edit/${id}`);
  };

  const handleDeleteUser = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteUser = () => {
    setLoading(true);
    setTimeout(() => {
      setUsers(users.filter((u) => u.id !== userToDelete.id));
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
      setLoading(false);
    }, 500);
  };

  const handleAddUser = () => {
    navigate('/admin/users/add');
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Tính toán dữ liệu hiển thị trên trang hiện tại
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
                  <th>User</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Option</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <img
                        src="https://via.placeholder.com/40"
                        alt={user.name}
                        className="admin__image-preview admin__image-preview--user"
                      />
                    </td>
                    <td>{user.name}</td>
                    <td>{user.phone}</td>
                    <td>{user.email}</td>
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
