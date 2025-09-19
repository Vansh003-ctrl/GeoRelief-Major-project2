/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            'x-auth-token': token
          }
        };
        const res = await axios.get(' https://georelief-major-project2.onrender.com/api/users', config);
        setUsers(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
  }, []);

  // ✅ Safe filtering to prevent crash
  const filteredUsers = users.filter(user =>
    (user?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (user?.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const handleEdit = (user) => {
    setCurrentUser(user);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            'x-auth-token': token
          }
        };
        await axios.delete(` https://georelief-major-project2.onrender.com/api/users/${userId}`, config);
        setUsers(users.filter(user => user._id !== userId));
        alert('User deleted successfully!');
      } catch (err) {
        console.error(err);
        alert('Failed to delete user. Please try again.');
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentUser(null);
    setIsEditing(false);
  };

  const handleSaveUser = async (e) => {
  e.preventDefault();

  if (!currentUser?.name || !currentUser?.email) {
    alert("Name and Email are required!");
    return;
  }

  try {
    const token = localStorage.getItem("token");
    const config = { headers: { "x-auth-token": token } };

    if (isEditing) {
      await axios.put(
        ` https://georelief-major-project2.onrender.com/api/users/${currentUser._id}`,
        { role: currentUser.role },
        config
      );
      setUsers(users.map(user =>
        user._id === currentUser._id ? currentUser : user
      ));
    } else {
      const res = await axios.post(
        " https://georelief-major-project2.onrender.com/api/auth/register",
        currentUser,
        config
      );

      // ✅ Fix: use currentUser instead of res.data
      setUsers([...users, {
        ...currentUser,
        _id: res.data._id || new Date().getTime().toString() // fallback if backend doesn’t return _id
      }]);
    }

    handleCloseModal();
    alert("User saved successfully!");
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.msg || "Failed to save user.");
  }
};


  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return 'badge bg-danger';
      case 'volunteer':
        return 'badge bg-primary';
      case 'user':
        return 'badge bg-secondary';
      default:
        return 'badge bg-light';
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>User Management</h2>
        <button
          className="btn btn-success"
          onClick={() => {
            setCurrentUser({ name: '', email: '', role: 'user', password: '' });
            setIsEditing(false);
            setShowModal(true);
          }}
        >
          Add New User
        </button>
      </div>

      <div className="d-flex mb-4">
        <div className="col-md-5">
          <input
            type="text"
            className="form-control"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          className="btn btn-primary ms-2"
          onClick={() => setSearchTerm('')}
        >
          <i className="bi bi-search"></i>Search
        </button>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers
                  .filter(user => user?.name && user?.email) // ✅ Skip invalid users
                  .map(user => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={getRoleBadge(user.role)}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-info me-2"
                        onClick={() => handleEdit(user)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(user._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleSaveUser}>
                <div className="modal-header">
                  <h5 className="modal-title">{isEditing ? 'Edit User' : 'Add User'}</h5>
                  <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={currentUser?.name || ''}
                      onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={currentUser?.email || ''}
                      onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
                      required
                    />
                  </div>

                  {/* Show password only when adding */}
                  {!isEditing && (
                    <div className="mb-3">
                      <label className="form-label">Password</label>
                      <input
                        type="password"
                        className="form-control"
                        name="password"
                        value={currentUser?.password || ''}
                        onChange={(e) => setCurrentUser({ ...currentUser, password: e.target.value })}
                        required
                      />
                    </div>
                  )}

                  <div className="mb-3">
                    <label className="form-label">Role</label>
                    <select
                      className="form-select"
                      name="role"
                      value={currentUser?.role || ''}
                      onChange={(e) => setCurrentUser({ ...currentUser, role: e.target.value })}
                      required
                    >
                      <option value="user">User</option>
                      <option value="volunteer">Volunteer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                    Close
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={!currentUser?.name || !currentUser?.email} // ✅ Prevent saving empty
                  >
                    Save changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
