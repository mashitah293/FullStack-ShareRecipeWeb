import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Category.css';

function Category() {
  const [selectedCategory, setSelectedCategory] = useState('default');
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {

    const fetchRecipes = () => {
      fetch('http://localhost:5000/subrecipe')
        .then((response) => response.json())
        .then((data) => {
          console.log("Fetched Recipes: ", data);
          setRecipes(data);
        })
        .catch((error) => console.error('Error fetching recipes:', error));
    };

    fetchRecipes();
  }, []);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const renderContent = () => {
    const filteredRecipes = recipes.filter(
      (recipe) => recipe.category === selectedCategory
    );
  
    if (filteredRecipes.length === 0) {
      return (
        <div>
          <p>No recipes found in this category.</p>
        </div>
      );
    }
  
    return (
      <div className="row">
        {filteredRecipes.map((recipe) => (
          <div key={recipe.id} className="col-md-4">
            <div className="card">
              <img
                src={recipe.imageUrl} // Use the Cloudinary image URL
                className="card-img-top"
                alt={recipe.recipeName}
                onError={(e) => {
                  console.error("Image failed to load:", recipe.imageUrl);
                  e.target.src = "path/to/placeholder-image.jpg"; // Fallback image if load fails
                }}
              />
              <div className="card-body">
                <h5 className="card-title">{recipe.recipeName}</h5>
                <p className="card-text">{recipe.description}</p>
                <a href={`/recdetail/${recipe.id}`} className="btn btn-primary">View Recipe</a>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };
  

  return (
    <div className="category-container">
      <nav className="side-nav">
        <h4>Recipes Category:</h4>
        <button onClick={() => handleCategoryClick('mdish')}>Main Dish</button>
        <button onClick={() => handleCategoryClick('beverage')}>Beverage</button>
        <button onClick={() => handleCategoryClick('dessert')}>Dessert</button>
        <button onClick={() => handleCategoryClick('other')}>Others</button>
      </nav>
      <div className="category-content">
        {selectedCategory === 'default' ? (
          <div className="card" style={{ textAlign: 'center' }}>
            <div className="card-body">
              <h1 className="card-title">Category</h1>
              <p className="card-text">Select a category from the sidebar to explore.</p>
            </div>
          </div>
        ) : (
          renderContent()
        )}
      </div>
    </div>
  );
}

export default Category;