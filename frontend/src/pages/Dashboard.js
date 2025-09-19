/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const DashboardMap = ({ incidents }) => {
    const defaultPosition = [28.7041, 77.1025];
    return (
        <MapContainer
            center={defaultPosition}
            zoom={10}
            scrollWheelZoom={false}
            style={{ height: '100%', width: '100%' }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {/* ✅ Incidents ko map par markers ke roop mein dikhayenge */}
            {incidents.map(incident => (
                <Marker key={incident._id} position={[incident.location.latitude, incident.location.longitude]} />
            ))}
        </MapContainer>
    );
};

const Dashboard = () => {
  // Stats Cards ke liye data
  const stats = [
    {
      title: "Total Incidents",
      value: "150",
      icon: "bi bi-exclamation-triangle-fill",
      color: "text-danger",
    },
    {
      title: "Active Disasters",
      value: "25",
      icon: "bi bi-fire",
      color: "text-warning",
    },
    {
      title: "Resources Available",
      value: "340",
      icon: "bi bi-boxes",
      color: "text-success",
    },
    {
      title: "Volunteers Active",
      value: "88",
      icon: "bi bi-person-fill",
      color: "text-info",
    },
  ];

  // Recent Incidents ke liye data
  const recentIncidents = [
    {
      id: 1,
      type: "Flood",
      location: "Mumbai",
      status: "Active",
      date: "2025-07-20",
    },
    {
      id: 2,
      type: "Earthquake",
      location: "Delhi",
      status: "Resolved",
      date: "2025-07-18",
    },
    {
      id: 3,
      type: "Fire",
      location: "Bengaluru",
      status: "Active",
      date: "2025-07-19",
    },
    {
      id: 4,
      type: "Cyclone",
      location: "Chennai",
      status: "Monitoring",
      date: "2025-07-17",
    },
  ];

  // Stories aur images ke liye data
  const stories = [
    {
      image: "/images/story-1-flood.png", // Path ab bilkul theek hai
      title: "Real-time Flooding in Mumbai",
      description:
        "Our GeoRelief network is providing real-time updates and coordinating aid for the recent floods. Teams are on the ground providing immediate assistance.",
    },
    {
      image: "/images/story-2-aid.png", // Path theek hai
      title: "Our Volunteers in Action",
      description:
        "Our dedicated volunteers are working tirelessly to distribute essential resources, from medical kits to food supplies, ensuring no one is left behind.",
    },
    {
      image: "/images/story-3-rescue.png", // Path theek hai
      title: "Quick Response and Rescue",
      description:
        "A swift response from our rescue teams saved lives in the recent earthquake. Our platform helped in locating the affected zones quickly.",
    },
  ];

  // ✅ Incidents list ke liye state
  const [incidents, setIncidents] = useState([]);

  // ✅ Page load hone par incidents fetch karein
  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/incidents");
        setIncidents(res.data);

        // Stats ko update karein
        setStats((prevStats) =>
          prevStats.map((stat) => {
            if (stat.title === "Total Incidents") {
              return { ...stat, value: res.data.length };
            }
            if (stat.title === "Active Disasters") {
              const activeCount = res.data.filter(
                (inc) => inc.status === "Active"
              ).length;
              return { ...stat, value: activeCount };
            }
            return stat;
          })
        );
      } catch (err) {
        console.error(err);
      }
    };
    fetchIncidents();
  }, []);

  // NavLink ko active class dene ke liye function
  const getNavLinkClass = ({ isActive }) => {
    return isActive
      ? "nav-link text-white active-link bg-primary rounded"
      : "nav-link text-white";
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      {/* Main Content Area */}
      <div className="flex-grow-1 p-4 bg-light">
        <h1 className="mb-4 text-secondary fw-bold">GeoRelief</h1>
        <p className="text-muted mb-5">
          Welcome to your GeoRelief dashboard. Here's a quick overview of the
          current situation.
        </p>

        {/* --- Statistics Cards --- */}
        <div className="row g-4 mb-5">
          {stats.map((stat, index) => (
            <div className="col-md-3" key={index}>
              <div className="card shadow-sm h-100 border-0 stats-card-hover">
                <div className="card-body d-flex align-items-center">
                  <i className={`${stat.icon} ${stat.color} me-3 fs-3`}></i>
                  <div>
                    <p
                      className="text-muted text-uppercase mb-0"
                      style={{ fontSize: "0.8rem" }}
                    >
                      {stat.title}
                    </p>
                    <h4 className="fw-bold mb-0">{stat.value}</h4>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* --- Map and Recent Incidents --- */}
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="card shadow-sm h-100 border-0">
              <div className="card-body p-0">
                <div className="card-header bg-white">
                  <h5 className="mb-0 text-secondary fw-bold">Disaster Map</h5>
                </div>
                <div
                  style={{ height: "400px", backgroundColor: "#e9ecef" }}
                  className="d-flex justify-content-center align-items-center"
                >
                  <DashboardMap incidents={incidents} />
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card shadow-sm h-100 border-0">
              <div className="card-body p-0">
                <div className="card-header bg-white">
                  <h5 className="mb-0 text-secondary fw-bold">
                    Recent Incidents
                  </h5>
                </div>
                <div className="list-group list-group-flush">
                  {incidents.length > 0 ? (
                    incidents.slice(0, 5).map((incident) => (
                      <div
                        key={incident._id}
                        className="list-group-item d-flex justify-content-between align-items-center"
                      >
                        <div>
                          <h6 className="mb-1">
                            {incident.title} in {incident.location.latitude}
                          </h6>
                          <small className="text-muted">
                            {new Date(incident.createdAt).toLocaleDateString()}
                          </small>
                        </div>
                        <span
                          className={`badge ${
                            incident.status === "Reported"
                              ? "bg-danger"
                              : incident.status === "Resolved"
                              ? "bg-success"
                              : "bg-secondary"
                          }`}
                        >
                          {incident.status}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="list-group-item text-center text-muted">
                      No incidents reported yet.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- Stories Section --- */}
        <hr className="my-5" />
        <h2 className="mb-4 text-secondary fw-bold">Stories from the Field</h2>
        {stories.map((story, index) => (
          <div
            key={index}
            className={`row g-0 align-items-center stories-card-hover mb-5 p-4 rounded shadow-sm bg-white ${
              index % 2 !== 0 ? "flex-row-reverse" : ""
            }`}
          >
            <div className="col-md-6 p-4 d-flex justify-content-center align-items-center">
              {" "}
              {/* Added flex classes */}
              <img
                src={story.image}
                className="img-fluid rounded shadow-sm"
                alt={story.title}
                style={{
                  maxWidth: "400px",
                  maxHeight: "250px",
                  objectFit: "cover",
                }} // ✅ Yeh line add/change karein
              />
            </div>
            <div className="col-md-6 p-4">
              <h4 className="fw-bold mb-3 text-primary">{story.title}</h4>
              <p className="text-muted">{story.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
