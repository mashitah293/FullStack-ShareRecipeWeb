
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Subrec.css';

function SubRec() {
  const [recipeName, setRecipeName] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [cookingSteps, setCookingSteps] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !recipeName ||
      !description ||
      !ingredients ||
      !cookingSteps ||
      !difficulty ||
      !category ||
      !image
    ) {
      alert('Please fill out all fields before submitting.');
      return;
    }

    // Prepare data to send to your server
    const formData = new FormData();
    formData.append('recipeName', recipeName);
    formData.append('description', description);
    formData.append('ingredients', ingredients);
    formData.append('cookingSteps', cookingSteps);
    formData.append('difficulty', difficulty);
    formData.append('category', category);
    formData.append('image', image);

    try {
      const res = await axios.post("http://localhost:5000/subrecipe", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log(res);
      setShowModal(true);  // Show the custom pop-up modal on success

      // Clear input fields after successful submission
      setRecipeName('');
      setDescription('');
      setIngredients('');
      setCookingSteps('');
      setDifficulty('');
      setCategory('');
      setImage(null);
    } catch (err) {
      console.error('Error submitting recipe:', err);
      // Handle the error accordingly
    }
  }

  function handleCloseModal() {
    setShowModal(false);
    navigate("/prf"); // Navigate to the profile page after closing the modal
  }

  return (
    <div className="subrec-container">
      <h1 className="subrec-title">Submit Recipe</h1>
      <form onSubmit={handleSubmit} className="subrec-form">
        <div className="subrec-form-group">
          <label htmlFor="recipeName" className="subrec-label">Recipe Name:</label>
          <input type="text" id="recipeName" className="subrec-input" value={recipeName} onChange={(e) => setRecipeName(e.target.value)} />
        </div>
        <div className="subrec-form-group">
          <label htmlFor="description" className="subrec-label">Description:</label>
          <textarea id="description" className="subrec-textarea" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div className="subrec-form-group">
          <label htmlFor="ingredients" className="subrec-label">Ingredients: (put ',' at the end of each ingredient)</label>
          <textarea id="ingredients" className="subrec-textarea" value={ingredients} onChange={(e) => setIngredients(e.target.value)} />
        </div>
        <div className="subrec-form-group">
          <label htmlFor="cookingSteps" className="subrec-label">Cooking Steps: (put '.' at the end of each step)</label>
          <textarea id="cookingSteps" className="subrec-textarea" value={cookingSteps} onChange={(e) => setCookingSteps(e.target.value)} />
        </div>
        <div className="subrec-form-group">
          <label htmlFor="image" className="subrec-label">Upload Image:</label>
          <input type="file" id="image" className="subrec-input" onChange={(e) => setImage(e.target.files[0])} />
        </div>

        <div className="subrec-form-group">
          <label htmlFor="difficulty" className="subrec-label">Level of Difficulty:</label>
          <div className="subrec-radio-group">
            <input type="radio" id="easy" name="difficulty" className="subrec-radio" value="easy" checked={difficulty === 'easy'} onChange={() => setDifficulty('easy')} />
            <label htmlFor="easy" className="subrec-label">Easy</label>
          </div>
          <div className="subrec-radio-group">
            <input type="radio" id="medium" name="difficulty" className="subrec-radio" value="medium" checked={difficulty === 'medium'} onChange={() => setDifficulty('medium')} />
            <label htmlFor="medium" className="subrec-label">Medium</label>
          </div>
          <div className="subrec-radio-group">
            <input type="radio" id="hard" name="difficulty" className="subrec-radio" value="hard" checked={difficulty === 'hard'} onChange={() => setDifficulty('hard')} />
            <label htmlFor="hard" className="subrec-label">Hard</label>
          </div>
        </div>

        <div className="subrec-form-group">
          <label className="subrec-label">Category:</label>
          <div className="subrec-radio-group">
            <input type="radio" id="mdish" name="category" className="subrec-radio" value="mdish" checked={category === 'mdish'} onChange={(e) => setCategory(e.target.value)} />
            <label htmlFor="mdish" className="subrec-label">Main Dish</label>
          </div>
          <div className="subrec-radio-group">
            <input type="radio" id="beverage" name="category" className="subrec-radio" value="beverage" checked={category === 'beverage'} onChange={(e) => setCategory(e.target.value)} />
            <label htmlFor="beverage" className="subrec-label">Beverage</label>
          </div>
          <div className="subrec-radio-group">
            <input type="radio" id="dessert" name="category" className="subrec-radio" value="dessert" checked={category === 'dessert'} onChange={(e) => setCategory(e.target.value)} />
            <label htmlFor="dessert" className="subrec-label">Dessert</label>
          </div>
          <div className="subrec-radio-group">
            <input type="radio" id="other" name="category" className="subrec-radio" value="other" checked={category === 'other'} onChange={(e) => setCategory(e.target.value)} />
            <label htmlFor="other" className="subrec-label">Others</label>
          </div>
        </div>

        <button type="submit" className="subrec-button">Submit Recipe</button>
      </form>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Your Recipe has been submitted</h2>
            <button onClick={handleCloseModal} className="modal-close-button">OK</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SubRec;
