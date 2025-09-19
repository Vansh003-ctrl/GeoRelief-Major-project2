/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ResourceManagement = () => {
  const [resources, setResources] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newResource, setNewResource] = useState({
    name: '',
    quantity: '',
    location: '',
    status: 'Available'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // ✅ Fetch resources on load
  useEffect(() => {
    const fetchResources = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = { headers: { "x-auth-token": token } };

        const res = await axios.get("http://localhost:5000/api/resources", config);
        setResources(res.data);
      } catch (err) {
        console.error("Error fetching resources:", err.response?.data || err.message);
      }
    };

    fetchResources();
  }, []);

  // ✅ Live stats (calculated from resources)
  const totalResources = resources.length;
  const availableResources = resources.filter(r => r.status === "Available").length;
  const inTransitResources = resources.filter(r => r.status === "In Transit").length;
  const allocatedResources = resources.filter(r => r.status === "Allocated").length;

  // ✅ Filter resources
  const filteredResources = resources.filter(resource => {
    const matchesSearch =
      resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'All' || resource.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewResource(prev => ({ ...prev, [name]: value }));
  };

  // ✅ Add / Update resource
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const config = { headers: { "x-auth-token": token } };

      if (isEditing) {
        // 🔹 Update resource
        const res = await axios.put(
          `http://localhost:5000/api/resources/${editingId}`,
          newResource,
          config
        );

        setResources(resources.map(r => (r._id === editingId ? res.data : r)));
        alert("Resource updated successfully!");
      } else {
        // 🔹 Add new resource
        const res = await axios.post(
          "http://localhost:5000/api/resources",
          newResource,
          config
        );

        setResources([...resources, res.data]);
        alert("Resource added successfully!");
      }

      // reset
      setNewResource({ name: "", quantity: "", location: "", status: "Available" });
      setIsModalOpen(false);
      setIsEditing(false);
      setEditingId(null);

    } catch (err) {
      console.error("Error saving resource:", err.response?.data || err.message);
      alert(err.response?.data?.msg || "Failed to save resource. Please try again.");
    }
  };

  // ✅ Delete resource
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this resource?")) return;

    try {
      const token = localStorage.getItem("token");
      const config = { headers: { "x-auth-token": token } };

      await axios.delete(`http://localhost:5000/api/resources/${id}`, config);
      setResources(resources.filter(r => r._id !== id));
      alert("Resource deleted successfully!");
    } catch (err) {
      console.error("Error deleting resource:", err.response?.data || err.message);
      alert("Failed to delete resource. Please try again.");
    }
  };

  // ✅ Open modal for editing
  const handleEditClick = (resource) => {
    setIsModalOpen(true);
    setIsEditing(true);
    setEditingId(resource._id);
    setNewResource({
      name: resource.name,
      quantity: resource.quantity,
      location: resource.location,
      status: resource.status,
    });
  };

  return (
    <div className="container mt-5">
      {/* Top header + Add button */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Resource Management</h2>
        <button className="btn btn-success" onClick={() => {
          setIsModalOpen(true);
          setIsEditing(false);
          setNewResource({ name: '', quantity: '', location: '', status: 'Available' });
        }}>
          <i className="bi bi-plus-lg me-2"></i> Add New Resource
        </button>
      </div>

      {/* Stats */}
      <div className="row g-4 mb-5">
        <div className="col-md-3">
          <div className="card shadow-sm h-100 border-0 stats-card-hover">
            <div className="card-body d-flex align-items-center">
              <i className="bi bi-boxes text-primary me-3 fs-3"></i>
              <div>
                <p className="text-muted text-uppercase mb-0" style={{ fontSize: '0.8rem' }}>Total Resources</p>
                <h4 className="fw-bold mb-0">{totalResources}</h4>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm h-100 border-0 stats-card-hover">
            <div className="card-body d-flex align-items-center">
              <i className="bi bi-truck text-warning me-3 fs-3"></i>
              <div>
                <p className="text-muted text-uppercase mb-0" style={{ fontSize: '0.8rem' }}>Resources In-Transit</p>
                <h4 className="fw-bold mb-0">{inTransitResources}</h4>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm h-100 border-0 stats-card-hover">
            <div className="card-body d-flex align-items-center">
              <i className="bi bi-box-seam text-info me-3 fs-3"></i>
              <div>
                <p className="text-muted text-uppercase mb-0" style={{ fontSize: '0.8rem' }}>Resources Allocated</p>
                <h4 className="fw-bold mb-0">{allocatedResources}</h4>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm h-100 border-0 stats-card-hover">
            <div className="card-body d-flex align-items-center">
              <i className="bi bi-patch-check text-success me-3 fs-3"></i>
              <div>
                <p className="text-muted text-uppercase mb-0" style={{ fontSize: '0.8rem' }}>Available Now</p>
                <h4 className="fw-bold mb-0">{availableResources}</h4>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="d-flex justify-content-between mb-4">
        <div className="col-md-6 d-flex">
          <input
            type="text"
            className="form-control"
            placeholder="Search resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            className="btn btn-primary ms-2"
            onClick={() => {
              console.log("Searching for:", searchTerm);
            }}
          >
            <i className="bi bi-search"></i> Search
          </button>
        </div>

        <div className="col-md-3">
          <select
            className="form-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Available">Available</option>
            <option value="In Transit">In Transit</option>
            <option value="Allocated">Allocated</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>Resource Name</th>
                  <th>Quantity</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredResources.map(resource => (
                  <tr key={resource._id}>
                    <td>{resource.name}</td>
                    <td>{resource.quantity}</td>
                    <td>{resource.location}</td>
                    <td>
                      <span className={`badge ${resource.status === 'Available'
                        ? 'bg-success'
                        : resource.status === 'In Transit'
                          ? 'bg-warning'
                          : 'bg-secondary'}`}>
                        {resource.status}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-sm btn-info me-2 text-white"
                        onClick={() => handleEditClick(resource)}>
                        Edit
                      </button>
                      <button className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(resource._id)}>
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
      {isModalOpen && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleFormSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">{isEditing ? "Edit Resource" : "Add New Resource"}</h5>
                  <button type="button" className="btn-close" onClick={() => setIsModalOpen(false)}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="resourceName" className="form-label">Resource Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="resourceName"
                      name="name"
                      value={newResource.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="quantity" className="form-label">Quantity</label>
                    <input
                      type="number"
                      className="form-control"
                      id="quantity"
                      name="quantity"
                      value={newResource.quantity}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="location" className="form-label">Location</label>
                    <input
                      type="text"
                      className="form-control"
                      id="location"
                      name="location"
                      value={newResource.location}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="status" className="form-label">Status</label>
                    <select
                      className="form-select"
                      id="status"
                      name="status"
                      value={newResource.status}
                      onChange={handleInputChange}
                    >
                      <option value="Available">Available</option>
                      <option value="In Transit">In Transit</option>
                      <option value="Allocated">Allocated</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary"
                    onClick={() => setIsModalOpen(false)}>Close</button>
                  <button type="submit" className="btn btn-primary">Save changes</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceManagement;
