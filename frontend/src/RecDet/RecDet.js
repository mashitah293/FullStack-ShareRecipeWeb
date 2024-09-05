import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './RecDet.css';

function RecDet() {
  const { id } = useParams(); // Get the recipe ID from the URL
  const [recipe, setRecipe] = useState(null);
  const [comments, setComments] = useState([]); // Add a state for comments
  const [newComment, setNewComment] = useState({ name: '', comment: '', rating: 0 }); // Add a state for new comment
  const [alert, setAlert] = useState(null); // Add a state for alert

  useEffect(() => {
    // Fetch the recipe details by ID
    fetch(`http://localhost:5000/recipe/${id}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched Recipe Details: ", data); // Debugging line
        setRecipe(data);
      })
      .catch((error) => console.error('Error fetching recipe details:', error));
  }, [id]);

  useEffect(() => {
    // Fetch the comments for the recipe
    fetch(`http://localhost:5000/recipe/${id}/comments`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched Comments: ", data); // Debugging line
        setComments(data);
      })
      .catch((error) => console.error('Error fetching comments:', error));
  }, [id]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewComment((prevComment) => ({ ...prevComment, [name]: value }));
  };

  const handleCommentSubmit = (event) => {
    event.preventDefault();
    const { name, comment, rating } = newComment;
    fetch(`http://localhost:5000/recipe/${id}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, comment, rating }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Comment submitted successfully:", data);
        // Add the new comment to the comments array
        setComments((prevComments) => [...prevComments, newComment]);
        // Reset the new comment state
        setNewComment({ name: '', comment: '', rating: 0 });
        setAlert('Comment submitted successfully!');
        setTimeout(() => {
          setAlert(null);
        }, 3000); // hide alert after 3 seconds
      })
      .catch((error) => console.error('Error submitting comment:', error));
  };

  if (!recipe) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container recipe-detail">
      <h1 className="recipe-title">{recipe.recipeName}</h1>
      {recipe.imageUrl ? (
        <img
          src={recipe.imageUrl} // Check this line for correctness
          className="img-fluid"
          alt={recipe.recipeName}
        />
      ) : (
        <p>No image available</p>
      )}
      <div className="recipe-description">
        <h3>Description</h3>
        <p>{recipe.description}</p>
      </div>
      <div className="recipe-ingredients">
        <h3>Ingredients</h3>
        <ul>
          {recipe.ingredients.split(',').map((ingredients, index) => (
            <li key={index}>{ingredients}</li>
          ))}
        </ul>
      </div>
      <div className="recipe-steps">
        <h3>Cooking Steps</h3>
        <ol>
          {recipe.cookingSteps.split('.').filter(step => step.trim()).map((step, index) => (
            <li key={index}>{step.trim()}</li>
          ))}
        </ol>
      </div>
      <div className="recipe-difficulty">
        <h3>Level Difficulty: {recipe.difficulty}</h3>
      </div>
      <div className="comment-section">
        <h3>Comments</h3>
        <ul>
          {comments.map((comment, index) => (
            <li key={index}>
              <p><strong>{comment.name}</strong>: {comment.comment} ({comment.rating}/5)</p>
            </li>
          ))}
        </ul>
        <form onSubmit={handleCommentSubmit} className="comment-form">
          <div className="form-group"style={{width:'700px',marginLeft:'80px'}}>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={newComment.name}
              onChange={handleInputChange}
              className="form-control"
            />
          </div>
          <div className="form-group" style={{width:'700px',marginLeft:'80px'}}>
            <label>Comment:</label>
            <textarea
              name="comment"
              value={newComment.comment}
              onChange={handleInputChange}
              className="form-control"
            />
          </div>
          <div className="form-group"style={{width:'700px',marginLeft:'80px'}}>
            <label>Rating:</label>
            <select name="rating" value={newComment.rating} onChange={handleInputChange} className="form-control">
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100px',marginLeft:'80px'}}>
            Submit
          </button>
          {alert && (
            <div className="alert alert-success" style={{ marginTop: '10px' }}>
              {alert}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default RecDet;


