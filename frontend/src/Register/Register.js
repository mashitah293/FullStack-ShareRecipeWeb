import React, { useState } from 'react';
import axios from 'axios';
import './Register.css'; // Import your CSS file for additional styling
import AOS from 'aos';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async (event) => {
    event.preventDefault();  // Prevent form from refreshing the page

    try {
      const response = await axios.post('http://localhost:5000/api/register', {
        username: name,
        email,
        password,
        confirmPassword
      });

      setMessage(response.data.message);  // Show success or error message
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
    <div className="container mb-5" id='register' data-aos="fade-up"
    data-aos-anchor-placement="top-center">
      <div className="row justify-content-center">
        <div className="col-md-3" id='kotak'>
          <div className="card mt-5 p-4">
            <div className="card-body bg-white">
              <h2 className="c-text-center mb-4">Sign Up</h2>
              <form onSubmit={handleRegister}>
                <div className="form-group">
                  <label htmlFor="name" className='text-start'>Full Name</label>
                  <input type="text" className="form-control" id="name" placeholder="Enter your full name"
                    value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="form-group">
                  <label htmlFor="email" className='text-start'>Email</label>
                  <input type="email" className="form-control" id="email" placeholder="Enter your email"
                    value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="form-group">
                  <label htmlFor="password" className='text-start'>Password</label>
                  <input type="password" className="form-control" id="password" placeholder="Create a password"
                    value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className="form-group">
                  <label htmlFor="confirm-password" className='text-start'>Confirm Password</label>
                  <input type="password" className="form-control" id="confirm-password" placeholder="Confirm your password"
                    value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>
                <button type="submit" className="btn btn-block custom-btn mt-2">Sign Up</button>
                {message && <p className='b-text-center font-weight-light mt-2'>{message}</p>}
                <p className='b-text-center font-weight-light'>Already have an account? <a href="/login" className='text'>Login</a></p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
