import React, { useState, useEffect } from 'react';
import './Home.css'; // Ensure this CSS file exists

function Home() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch('http://localhost:5000/subrecipe');
        const data = await response.json();
        setRecipes(data);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };

    fetchRecipes();
  }, []);

  return (
    <div>
      <div style={{ display: "flex" }}>
        <div style={{ float: 'left', marginLeft: '10px', width: '50%' }}>
          <h1 style={{ fontFamily: 'cursive', color: '#332C23', fontSize: '40px', paddingTop: '100px' }}>Welcome to ShareRippy</h1>
          <h5 style={{ color: '#332C23', textAlign: 'justify', paddingLeft: '20px', paddingRight: '20px' }}>
            At ShareRippy, we connect food lovers globally to share and discover favorite recipes and cooking tips. 
            Whether you're an experienced chef or a home cook seeking inspiration, our community lets you exchange culinary creations 
            and celebrate the joy of cooking together. Join us and be part of a global kitchen where every recipe tells a story.<br>
            </br>
            <br></br>
            "The best way to find yourself is to lose yourself in the service of others."
          </h5>
        </div>

        <div style={{ float: 'right', marginRight: '10px', width: '45%', paddingTop: '20px' }}>
          <div id="carouselExampleCaptions" className="carousel slide" data-ride="carousel" data-interval="3000">
            <ol className="carousel-indicators">
              {recipes.slice(0, 3).map((_, index) => (
                <li
                  key={index}
                  data-target="#carouselExampleCaptions"
                  data-slide-to={index}
                  className={index === 0 ? "active" : ""}
                ></li>
              ))}
            </ol>
            <div className="carousel-inner">
              {recipes.slice(0, 3).map((recipe, index) => (
                <div key={recipe.id} className={`carousel-item ${index === 0 ? "active" : ""}`}>
                  <img
                    src={recipe.imageUrl || 'placeholder-image.jpg'}
                    className="d-block w-100"
                    alt={recipe.recipeName}
                    style={{ height: '400px', objectFit: 'cover' }}
                  />
                  <div className="carousel-caption d-none d-md-block">
                    <h5>{recipe.recipeName}</h5>
                  </div>
                </div>
              ))}
            </div>
            <button className="carousel-control-prev" type="button" data-target="#carouselExampleCaptions" data-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="sr-only">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-target="#carouselExampleCaptions" data-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="sr-only">Next</span>
            </button>
          </div>
        </div>
      </div>
      
      <div>
        <br />
        <h3 style={{ color: 'white', backgroundColor: '#886644', padding: '10px' }}>Our Top Recipe</h3>
        <div className="d-flex justify-content-center">
          <div className="row">
            {recipes.slice(0, 3).map((recipe) => (
              <div key={recipe.id} className="col-md-4">
                <div className="card">
                  <img src={recipe.imageUrl || 'placeholder-image.jpg'} className="card-img-top" alt={recipe.recipeName} />
                  <div className="card-body">
                    <h5 className="card-title">{recipe.recipeName}</h5>
                    <p className="card-text">{recipe.description}</p>
                    <a href={`/recdetail/${recipe.id}`} className="btn btn-primary">View Recipe</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <h3 style={{ color: 'white', backgroundColor: '#886644', padding: '10px' }}>Explore More Recipe</h3>
      <div style={{ display: "flex" }}>
        <div style={{ float: 'left', marginLeft: '10px', width: '50%' }}>
          <h1 style={{ fontFamily: 'cursive', color: '#332C23', fontSize: '40px', paddingTop: '100px' }}>See More Recipe</h1>
          <h5 style={{ color: '#332C23', textAlign: 'justify', paddingLeft: '20px', paddingRight: '20px' }}>
            Dive into our treasure trove of recipes, where you'll find mouth-watering dishes across every category imaginable! From quick weeknight dinners to decadent desserts, we've got the perfect recipe for every occasion.
          </h5>
          <a href="/ctg" className="btn btn-primary">Explore More Recipe</a>
        </div>
        <img src='food.jpg' style={{ width: '700px', padding: '20px' }} alt="ads-img" />
      </div>
    </div>
  );
}

export default Home;
