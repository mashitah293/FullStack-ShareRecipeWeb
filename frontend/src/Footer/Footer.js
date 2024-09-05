import React from 'react';
import { Link } from 'react-router-dom'
import './Footer.css';

function Footer() {
  return (
    <div className='footer'>
      <ul className='footer-ul'>
        <li><a href="/">Home</a></li>
        <li><a href="/ctg">Category</a></li>
        <li><a href="/register">SignUp</a></li>
        <li><a href="/login">Login</a></li>
      </ul>
      <br></br>
      <div>
        <h5>Copyright&copy; 2024 ShareRippy</h5>
      </div>
    </div>
  );
}

export default Footer;