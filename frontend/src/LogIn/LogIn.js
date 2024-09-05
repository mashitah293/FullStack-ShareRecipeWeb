import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Import useNavigate from react-router-dom
import './LogIn.css';
import { useAuth } from '../Authcontext'; 
import AOS from 'aos';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();  // Initialize useNavigate
  const { login } = useAuth();

  const handleLogin = async (event) => {
    event.preventDefault();  // Prevent form from refreshing the page

    try {
      const response = await axios.post('http://localhost:5000/api/login', { email, password });

      if (response.data.user) {
        setMessage('Login successful!');
        // Redirect to the home page after a successful login
        login(response.data.user);
        navigate('/');  // Replace '/home' with your home page route
      }
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.message);  // Show error message from backend
      } else {
        setMessage('An error occurred. Please try again.');
      }
    }
  };

  AOS.init();

  return (
    <div className="container" id='login' data-aos="fade-zoom-in"
    data-aos-easing="ease-in-back"
    data-aos-delay="300"
    data-aos-offset="0">
      <div className="row justify-content-center">
        <div className="col-md-3">
          <div className="card mt-3 p-4">
            <div className="card-body bg-white">
              <h2 className="a-text-center mb-4">Login</h2>
              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <label htmlFor="email" className='a-text-start'>Email</label>
                  <input type="email" className="form-control" id="email" placeholder="Enter your email"
                    value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="form-group">
                  <label htmlFor="password" className='a-text-start'>Password</label>
                  <input type="password" className="form-control mb-4" id="password" placeholder="Enter your password"
                    value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button type="submit" className="btn btn-block custom-btn">Login</button>
                {message && <p className='b-text-center font-weight-light mt-2'>{message}</p>}
                <p className='b-text-center font-weight-light'>Don't have an account? <a href="/register" className='text'>Sign Up</a></p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
