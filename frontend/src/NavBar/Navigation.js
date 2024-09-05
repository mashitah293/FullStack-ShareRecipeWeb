import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navigation.css';
import Person2Icon from '@mui/icons-material/Person2';
import SearchIcon from '@mui/icons-material/Search';
import { useAuth } from '../Authcontext';

function Navigation() {
    const { isAuthenticated, logout } = useAuth(); // Access authentication state and logout function
    console.log('Is Authenticated:', isAuthenticated);

    // State hook to store the current search query
    const [searchQuery, setSearchQuery] = useState('');
    // Hook to access the navigate function for programmatic navigation
    const navigate = useNavigate();

    // Function to update searchQuery state when input changes
    const handleSearchChange = (e) => {
        // Set the state to the current value of the input field
        setSearchQuery(e.target.value);
    };

    // Function to handle form submission for search
    const handleSearchSubmit = (e) => {
        e.preventDefault(); // Prevent the default form submission which reloads the page
        // Check if searchQuery is not empty or just whitespace
        if (searchQuery.trim()) {
            // Navigate to the search results page with the query parameter
            navigate(`/search?query=${searchQuery}`);
        }
    };

    return (
        <div className="NavBar">
            <nav className="navbar navbar-expand-lg">
                <Link className="navbar-brand" to="/"><img src="ShareRippyLogo.jpg" alt="logo" id='logo' /></Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item active">
                            <Link className="nav-link" to="/">Home</Link>
                        </li>
                        <li className="nav-item active">
                            <Link className="nav-link" to="ctg">Category</Link>
                        </li>
                        {/* Show Profile link only when user is authenticated */}
                        {isAuthenticated && (
                            <li className="nav-item active">
                                <Link className="nav-link" to="prf">Profile</Link>
                            </li>
                        )}
                    </ul>
                    <div className="container">
                        {/* Form for searching */}
                        <form className="d-flex align-items-center" role="search" onSubmit={handleSearchSubmit}>
                            {/* Search input field */}
                            <input
                                className="form-control me-2" // Bootstrap class for styling
                                type="search" // Input type for search
                                placeholder="Search" // Placeholder text
                                aria-label="Search" // ARIA label for accessibility
                                value={searchQuery} // Controlled input value
                                onChange={handleSearchChange} // Event handler for input changes
                            />
                            {/* Search button */}
                            <button className="navbtn btn-outline-light" type="submit">
                                <SearchIcon /> Search
                            </button>
                            {/* Show Login button if not authenticated; otherwise, show Logout button */}
                            {!isAuthenticated ? (
                                <Link className="navbtn btn-outline-light" to="login"><><Person2Icon />Login</></Link>
                            ) : (
                                <button className="navbtn btn-outline-light" onClick={logout}><><Person2Icon />Logout</></button>
                            )}
                        </form>
                    </div>
                </div>
            </nav>
        </div>
    );
}

export default Navigation;
