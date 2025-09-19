import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage = () => {
    // Form data ko manage karne ke liye state
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const navigate = useNavigate();

    // Input fields mein change hone par state update karein
    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    // Form submit hone par yeh function call hoga
    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            // ✅ Backend ke login route par POST request bhejenge
            const res = await axios.post('http://localhost:5000/api/auth/login', formData);

            console.log("Response from backend:", res.data);
            
            // ✅ Token ko localStorage mein save karein
            localStorage.setItem('token', res.data.token);
            
            alert('Login Successful!');
            navigate('/dashboard'); // ✅ Dashboard par redirect karein

        } catch (err) {
            console.error(err.response.data);
            
            alert(err.response.data.msg || 'Login failed');
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <h1 className='fs-2 text-center mb-5'>Welcome to GeoRelief❤️</h1>
                    <div className="card shadow-sm stats-card-hover">
                        <div className="card-body">
                            <h2 className="card-title text-center mb-4">Log in</h2>
                            <form onSubmit={onSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email address</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={onChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={onChange}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary w-100">Login</button>
                            </form>
                            <p className="text-center mt-3">
                                Don't have an account? <Link to="/register">Sign up here</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;