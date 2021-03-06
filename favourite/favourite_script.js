// Selectors
const favouriteMealContainer = document.getElementById("favourite-meals-container");
const mealDetailsContainer = document.getElementById("meal-details-container");
const backButton = document.getElementsByClassName("back-button")[0];
const favMsg = document.getElementById("fav-msg");

// Event Listeners
document.addEventListener("DOMContentLoaded", getFavouriteMeals);
favouriteMealContainer.addEventListener("click", removeFromFavourites);
favouriteMealContainer.addEventListener("click", getRecipeDetails);
backButton.addEventListener("click", closeRecipeDetails);


// Functions
// fetches and displays all favourite meals
function getFavouriteMeals() {
  let favouriteMealsId;
  if (localStorage.getItem("favourites") === null) {
    favouriteMealsId = [];
    return;
  } else {
    favouriteMealsId = JSON.parse(localStorage.getItem("favourites"));
  }

  let content = "";
  // loop over each meal ID and fetch for meals
  favouriteMealsId.forEach((mealId) => {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
      .then((response) => response.json())
      .then((data) => addfavouriteMeals(data.meals[0], content));
  });
}

// helper funtion that appends favourite meal to container
function addfavouriteMeals(meal, content) {
  content = `
  <div class = "card" id = "${meal.idMeal}">
    <div class = "meal-img">
        <img src = "${meal.strMealThumb}" class="card-img-top" alt = "food">
    </div>
    <div class = "meal-name">
        <h5>${meal.strMeal}</h5>
        <a href = "#" class = "btn btn-primary recipe-button">Get Recipe</a>
    </div>
    <button type="submit" class="btn btn-sm btn-outline-danger unfavourite-button">Remove</button>
    </div>`;
    // To remove msg if there are favourite items
    favMsg.setAttribute("style","display:none");
  favouriteMealContainer.innerHTML += content;
}

// to remove favourites from local storage
function removeFromFavourites(event) {
  if (!event.target.classList.contains("unfavourite-button")) {
    return;
  }
  // if unfavourite button is clicked get id of parent
  let favouriteMeal = event.target.parentElement;
  let mealId = favouriteMeal.id;
  let favouriteMealsId = JSON.parse(localStorage.getItem("favourites"));

  // find the id in the array of all favourite meals
  let idx = favouriteMealsId.indexOf(mealId);

  // remove the id from the array and save array in local storage
  favouriteMealsId.splice(idx, 1);
  localStorage.setItem("favourites", JSON.stringify(favouriteMealsId));

  // remove favourite meal element
  favouriteMeal.remove();
}



// To display recipe details
function getRecipeDetails(event) {
  if (event.target.classList.contains("recipe-button")) {
    let mealItem = event.target.parentElement.parentElement;
    const mealId = mealItem.id;
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
      .then((response) => response.json())
      .then((data) => addRecipeDetail(data.meals[0]));
  }
}

// function  to show recipe details
function addRecipeDetail(meal) {
  let content = `
    <h2 class = "recipe-title">${meal.strMeal}</h2>
    <div class = "other-info">
        <p><b>Origin: ${meal.strArea}</b></p>
        <p><b>Category: ${meal.strCategory}</b></p>
    </div>
    <div class = "recipe-meal-img">
        <img src = "${meal.strMealThumb}" alt = "">
    </div>
    <div class = "recipe-instructions">
        <p>${meal.strInstructions}</p>
    </div>
    <div class = "recipe-link">
        <b><a href = "${meal.strYoutube}" target = "_blank">Watch Video</a></b>
    </div>`;
    mealDetailsContainer.innerHTML = content;
    mealDetailsContainer.parentElement.classList.add("show-recipe");
}

// To close recipe details
function closeRecipeDetails() {
  // console.log("Back Clicked");
  mealDetailsContainer.parentElement.classList.remove("show-recipe");
}