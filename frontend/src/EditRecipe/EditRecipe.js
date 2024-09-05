import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const EditRecipe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState({
    recipeName: '',
    description: '',
    ingredients: '',
    cookingSteps: '',
    difficulty: '',
    category: '',
    image: null,
  });

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await fetch(`http://localhost:5000/recipe/${id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setRecipe(data);
      } catch (error) {
        console.error('Error fetching recipe:', error);
      }
    };

    fetchRecipe();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipe({ ...recipe, [name]: value });
  };

  const handleFileChange = (e) => {
    setRecipe({ ...recipe, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('recipeName', recipe.recipeName);
    formData.append('description', recipe.description);
    formData.append('ingredients', recipe.ingredients);
    formData.append('cookingSteps', recipe.cookingSteps);
    formData.append('difficulty', recipe.difficulty);
    formData.append('category', recipe.category);
    if (recipe.image) {
      formData.append('image', recipe.image);
    }

    try {
      const response = await axios.put(`http://localhost:5000/subrecipe/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        navigate('/profile'); // Redirect to profile page after successful update
      }
    } catch (error) {
      console.error('Error updating recipe:', error);
    }
  };

  return (
    <div className="subrec-container">
      <h1 className="subrec-title">Edit Recipe</h1>
      <form onSubmit={handleSubmit} className="subrec-form">
        <div className="subrec-form-group">
          <label htmlFor="recipeName" className="subrec-label">Recipe Name:</label>
          <input type="text" id="recipeName" name="recipeName" className="subrec-input" value={recipe.recipeName} onChange={handleChange} />
        </div>
        <div className="subrec-form-group">
          <label htmlFor="description" className="subrec-label">Description:</label>
          <textarea id="description" name="description" className="subrec-textarea" value={recipe.description} onChange={handleChange} />
        </div>
        <div className="subrec-form-group">
          <label htmlFor="ingredients" className="subrec-label">Ingredients:</label>
          <textarea id="ingredients" name="ingredients" className="subrec-textarea" value={recipe.ingredients} onChange={handleChange} />
        </div>
        <div className="subrec-form-group">
          <label htmlFor="cookingSteps" className="subrec-label">Cooking Steps:</label>
          <textarea id="cookingSteps" name="cookingSteps" className="subrec-textarea" value={recipe.cookingSteps} onChange={handleChange} />
        </div>
        <div className="subrec-form-group">
          <label htmlFor="image" className="subrec-label">Upload Image:</label>
          <input type="file" id="image" name="image" className="subrec-input" onChange={handleFileChange} />
        </div>
        <div className="subrec-form-group">
          <label htmlFor="difficulty" className="subrec-label">Level of Difficulty:</label>
          <div className="subrec-radio-group">
            <input type="radio" id="easy" name="difficulty" className="subrec-radio" value="easy" checked={recipe.difficulty === 'easy'} onChange={handleChange} />
            <label htmlFor="easy" className="subrec-label">Easy</label>
          </div>
          <div className="subrec-radio-group">
            <input type="radio" id="medium" name="difficulty" className="subrec-radio" value="medium" checked={recipe.difficulty === 'medium'} onChange={handleChange} />
            <label htmlFor="medium" className="subrec-label">Medium</label>
          </div>
          <div className="subrec-radio-group">
            <input type="radio" id="hard" name="difficulty" className="subrec-radio" value="hard" checked={recipe.difficulty === 'hard'} onChange={handleChange} />
            <label htmlFor="hard" className="subrec-label">Hard</label>
          </div>
        </div>
        <div className="subrec-form-group">
          <label className="subrec-label">Category:</label>
          <div className="subrec-radio-group">
            <input type="radio" id="mdish" name="category" className="subrec-radio" value="mdish" checked={recipe.category === 'mdish'} onChange={handleChange} />
            <label htmlFor="mdish" className="subrec-label">Main Dish</label>
          </div>
          <div className="subrec-radio-group">
            <input type="radio" id="beverage" name="category" className="subrec-radio" value="beverage" checked={recipe.category === 'beverage'} onChange={handleChange} />
            <label htmlFor="beverage" className="subrec-label">Beverage</label>
          </div>
          <div className="subrec-radio-group">
            <input type="radio" id="dessert" name="category" className="subrec-radio" value="dessert" checked={recipe.category === 'dessert'} onChange={handleChange} />
            <label htmlFor="dessert" className="subrec-label">Dessert</label>
          </div>
          <div className="subrec-radio-group">
            <input type="radio" id="other" name="category" className="subrec-radio" value="other" checked={recipe.category === 'other'} onChange={handleChange} />
            <label htmlFor="other" className="subrec-label">Others</label>
          </div>
        </div>
        <button type="submit" className="subrec-button">Update Recipe</button>
      </form>
    </div>
  );
};

export default EditRecipe;
