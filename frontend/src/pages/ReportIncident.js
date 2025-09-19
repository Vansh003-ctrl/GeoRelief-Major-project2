import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MapComponent from '../components/MapComponent'; // ✅ MapComponent import karein

const ReportIncident = () => {
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    description: '',
    location: {
      latitude: 0,
      longitude: 0,
    },
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ✅ Location ko update karne ke liye naya function
  const setLocation = (latlng) => {
    setFormData(prev => ({
      ...prev,
      location: {
        latitude: latlng.lat,
        longitude: latlng.lng
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://georelief.onrender.com/api/incidents', formData);
      
      console.log('Incident reported:', res.data);
      alert('Incident reported successfully!');
      navigate('/dashboard');
    } catch (err) {
      console.error(err.response.data);
      alert(err.response.data.msg || 'Failed to report incident.');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-lg-8 offset-lg-2">
          <div className="card shadow-sm">
            <div className="card-header bg-danger text-white">
              <h4 className="mb-0">Report a New Incident</h4>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">Incident Title</label>
                  <input type="text" className="form-control" id="title" name="title" value={formData.title} onChange={handleInputChange} required />
                </div>
                <div className="mb-3">
                  <label htmlFor="incidentType" className="form-label">Incident Type</label>
                  <select className="form-select" id="incidentType" name="type" value={formData.type} onChange={handleInputChange} required>
                    <option value="">Select Type</option>
                    <option value="Flood">Flood</option>
                    <option value="Earthquake">Earthquake</option>
                    <option value="Fire">Fire</option>
                    <option value="Cyclone">Cyclone</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">Description</label>
                  <textarea className="form-control" id="description" name="description" value={formData.description} onChange={handleInputChange} rows="4" required></textarea>
                </div>
                <div className="mb-3">
                  <label htmlFor="location" className="form-label">Location</label>
                  {/* ✅ Yahan par map lagayenge */}
                  <div className="border" style={{ height: '300px', width: "100%" }}>
                    <MapComponent setFormLocation={setLocation} />
                  </div>
                  <small className="form-text text-muted">Click on the map to set the location.</small>
                </div>
                <button type="submit" className="btn btn-danger w-100">Submit Report</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportIncident;