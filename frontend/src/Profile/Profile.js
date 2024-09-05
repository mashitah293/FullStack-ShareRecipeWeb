import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css'; // Importing the stylesheet for Profile component

const Profile = () => {
  // State to manage the active tab ('submitted' by default)
  const [activeTab, setActiveTab] = useState('submitted');
  
  // State to store user information fetched from the backend
  const [user, setUser] = useState([]);
  
  // State to store the user's submitted recipes
  const [recipes, setRecipes] = useState([]);
  
  // `useNavigate` hook to programmatically navigate between pages
  const navigate = useNavigate();

  // useEffect hook to fetch user data and recipes when the component mounts
  useEffect(() => {
    // Function to fetch the latest user information from the backend
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/user'); // API call to fetch user data
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json(); // Parse the fetched data into JSON format
        setUser(data); // Store the fetched user data into the state
      } catch (error) {
        console.error('Error fetching user data:', error); // Handle any errors that occur during fetch
      }
    };

    // Function to fetch the user's submitted recipes from the backend
    const fetchUserRecipes = async () => {
      try {
        const response = await fetch('http://localhost:5000/subrecipe'); // API call to fetch submitted recipes
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json(); // Parse the fetched recipes into JSON format
        setRecipes(data); // Store the fetched recipes into the state
      } catch (error) {
        console.error('Error fetching user recipes:', error); // Handle any errors that occur during fetch
      }
    };

    fetchUserData(); // Fetch user data when the component mounts
    fetchUserRecipes(); // Fetch user recipes when the component mounts
  }, []);

  // Function to handle tab selection (switch between tabs)
  const showTab = (tabName) => {
    setActiveTab(tabName); // Update the active tab state based on the clicked tab
  };

  // Function to handle the "Submit Recipe" button click
  const handleSubmitRecipeClick = () => {
    navigate('/subrecipe'); // Navigate to the submit recipe page
  };

  // Function to handle the deletion of a recipe
  const handleDeleteRecipe = async (recipeId) => {
    try {
      const response = await fetch(`http://localhost:5000/subrecipe/${recipeId}`, {
        method: 'DELETE', // Send a DELETE request to delete the recipe
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      // Filter out the deleted recipe from the state and update the UI
      setRecipes(recipes.filter(recipe => recipe.id !== recipeId));
    } catch (error) {
      console.error('Error deleting recipe:', error); // Handle any errors that occur during deletion
    }
  };

  // Render the profile page
  return (
    <section id="profile">
      {/* Display user information */}
      <div className="user-info">
        {user ? ( // Conditional rendering: Show user info, otherwise show a loading message
          <>
            <h2>{user.username}</h2> {/* Display the user's username */}
            <p>{user.email}</p> {/* Display the user's email */}
          </>
        ) : (
          <p>Loading user data...</p> // Display this message while user data is being fetched
        )}
      </div>

      {/* Render profile tabs for switching between sections */}
      <div className="profile-tabs">
        {/* Button to view latest submitted recipes */}
        <button className={`tab ${activeTab === 'submitted' ? 'active' : ''}`} onClick={() => showTab('submitted')}>Latest Recipes</button>
        
        {/* Button to navigate to the submit recipe page */}
        <button className={`submit-button`} onClick={handleSubmitRecipeClick}>Submit Recipe</button>
      </div>

      {/* Render the content of the selected tab */}
      <div className={`tab-content ${activeTab === 'submitted' ? 'active' : ''}`}>
        <h3 style={{ color: 'white' }}>Latest Recipes</h3>
        {recipes.length > 0 ? ( // Conditional rendering: Show recipes if available, otherwise show a message
          <ul className="recipe-list">
            {recipes.map((recipe) => ( // Loop through the recipes and render them in a list
              <li key={recipe.id}>
                {/* Display recipe thumbnail (or default image if none exists) */}
                <img src={recipe.imageUrl || 'default-recipe.png'} alt="Recipe Thumbnail" />
                <h4>{recipe.recipeName}</h4> {/* Display recipe name */}
                
                {/* Button to delete the recipe */}
                <button className="delete-button" onClick={() => handleDeleteRecipe(recipe.id)}>Delete</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No submitted recipes found.</p> // Message if no recipes are found
        )}
      </div>
    </section>
  );
};

export default Profile; // Export the Profile component for use in other parts of the app

