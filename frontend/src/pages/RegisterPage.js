import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const RegisterPage = () => {
    // Form data ko manage karne ke liye state
    const [formData, setFormData] = useState({
        name: '',
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
            // ✅ Backend se token aur user data lene ki request
            const res = await axios.post('http://localhost:5000/api/auth/register', formData);
            
            // ✅ Registration successful hone par token aur name ko localStorage mein save karein
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('userName', res.data.user.name); // Example: user ka naam save karna
            
            alert('Registration Successful!');
            navigate('/dashboard'); // ✅ Seedha dashboard par redirect karein
        } catch (err) {
            console.error(err.response.data);
            alert(err.response.data.msg || 'Registration failed');
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <h1 className='fs-2 text-center mb-5'>Welcome to GeoRelief❤️</h1>
                    <div className="card shadow-sm stats-card-hover">
                        <div className="card-body">
                            <h2 className="card-title text-center mb-4">Create Your Account</h2>
                            <form onSubmit={onSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={onChange}
                                        required
                                    />
                                </div>
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
                                <button type="submit" className="btn btn-primary w-100">Sign Up</button>
                            </form>
                            <p className="text-center mt-3">
                                Already have an account? <Link to="/login">Log in here</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;