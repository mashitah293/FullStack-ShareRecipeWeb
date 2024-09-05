import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Import axios for making API calls
import { useLocation, Link } from 'react-router-dom'; // Import hooks and components from react-router-dom for navigation and URL management
import './SearchResults.css'; // Import the CSS file for styling
import AOS from 'aos'; // Import AOS (Animate On Scroll) for animations

// Custom hook to parse query parameters from the URL
function useQuery() {
    return new URLSearchParams(useLocation().search); // Returns the URLSearchParams object to read query parameters
}

function SearchResults() {
    const [recipes, setRecipes] = useState([]); // State to store the list of recipes fetched from the backend
    const [loading, setLoading] = useState(true); // State to track loading status
    const [error, setError] = useState(null); // State to store any error messages
    const query = useQuery().get('query'); // Extract the 'query' parameter from the URL

    // useEffect hook to fetch search results when the query changes
    useEffect(() => {
        if (query) { // Only make the request if there is a search query
            axios.get(`http://localhost:5000/search?query=${query}`) // API call to the backend search endpoint
                .then(response => {
                    setRecipes(response.data); // Store the fetched recipes in state
                    setLoading(false); // Set loading to false after data is fetched
                })
                .catch(error => {
                    console.error("Error fetching search results: ", error); // Log any errors that occur during the request
                    setError("An error occurred while fetching data."); // Set error message if the request fails
                    setLoading(false); // Set loading to false even if an error occurs
                });
        }
    }, [query]); // This effect runs whenever the 'query' parameter changes

    // If data is still loading, display a loading message
    if (loading) return <p>Loading...</p>;

    // If there is an error, display the error message
    if (error) return <p>{error}</p>;

    // Initialize AOS (Animate On Scroll) for animations
    AOS.init();

    // Render the search results
    return (
        <div className="SearchResults" data-aos="zoom-in" data-aos-delay="300"> {/* Adding AOS animation */}
            <h2>Search Results for "{query}"</h2> {/* Display the search query */}
            {recipes.length > 0 ? ( // Conditional rendering: If recipes exist, display them
                <ul>
                    {recipes.map(recipe => ( // Loop through the recipes and render each one in a list
                        <li key={recipe.id}> {/* Each recipe has a unique key (id) */}
                            {/* If the recipe has an image URL, display it */}
                            {recipe.imageUrl && (
                                <img src={recipe.imageUrl} alt={recipe.recipeName} className="recipe-image" /> // Display the recipe image
                            )}
                            <h3>{recipe.recipeName}</h3> {/* Display the recipe name */}
                            <p>
                                <span className="category-box"> {/* Display the category of the recipe */}
                                    Category: 
                                    <Link to={`/ctg?ctg=${recipe.category}#${recipe.recipeName.replace(/\s+/g, '-')}`}> {/* Create a link to the category page */}
                                        {recipe.category}
                                    </Link>
                                </span>
                            </p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No results found for "{query}".</p> // Display this message if no recipes are found
            )}
        </div>
    );
}

export default SearchResults; // Export the SearchResults component for use in other parts of the app

