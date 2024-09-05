import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navigation from './NavBar/Navigation'
import Home from './Home/Home'
import Category from './Category/Category'
import Profile from './Profile/Profile'
import Footer from './Footer/Footer'
import Register from './Register/Register'
import LogIn from './LogIn/LogIn'
import SubRec from './SubRec/SubRec'
import RecDet from './RecDet/RecDet'
import SearchResults from './SearchResults/SearchResults'; // The new search results component
import './App.css'
function App() {
    return (
      
      <>
       <Router>
          <Navigation />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path='/ctg' element={<Category />} />
            <Route path='/prf' element={<Profile/>} />
            <Route path='/login' element={<LogIn />} />
            <Route path='/register' element={<Register />} />
            <Route path='/recdetail/:id' element={<RecDet />} />
            <Route path='/subrecipe' element={<SubRec />} />
            
            
          </Routes>
  
          <Footer />
        </Router>
      </ >
    )
  }
  
  export default App