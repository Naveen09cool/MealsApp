let searchTextElement = document.getElementById("search-meal-input");
const searchBtn = document.getElementById("search-btn");
const resultCardsContainer = document.getElementById("cards-container");
const mealDetailsContainer = document.getElementById("meal-details-container");
const backButton = document.getElementsByClassName("back-button")[0];
const mainContainer  = document.getElementById("main-container");


// EVENTS Listeners
searchBtn.addEventListener("click", searchMealFunc);
searchTextElement.addEventListener("input", searchMealFunc);
backButton.addEventListener("click", closeRecipeDetails);
resultCardsContainer.addEventListener("click", getRecipeDetails);
resultCardsContainer.addEventListener("click", addToFavourites);

// For clearing storage
// function lic() {
//   localStorage.clear();
// }

// Functions
// Searching meals
function searchMealFunc() {
    let searchText = searchTextElement.value;
    // Promise chaining
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchText}`)
      // convert response to json
    .then((response) => response.json())
    // json structure -> {meals:[]}
    .then((data) => {
      let list = "";
      if (data.meals) {
        // loop over every meal and add it to the list
        data.meals.forEach((meal) => {
          list += `
          <div class="card" id = "${meal.idMeal}">
              <img src="${meal.strMealThumb}" class="card-img-top" alt="Food Img">
              <div class="card-body">
                  <h5 class="card-title">${meal.strMeal}</h5>
                  <a href="#" class="btn btn-primary recipe-button">Get Recipe</a>
              </div>
          `;
          let favs = JSON.parse(localStorage.getItem("favourites"));
          let addedCheck = false;
          if(favs != null)
            addedCheck = favs.includes(meal.idMeal);

          if(addedCheck){
            // Added to Favourites btn
            list += `
              <button type="button" class="btn btn-danger added-button"><a href="./favourite/favourite.html" style="text-decoration:none; color:inherit;"><i class="bi bi-heart-fill" style="color:#f0f0dd;"></i> Favourite</a></a></button>
              </div>
            </div>`;
          }
          // Add Favourite
          else{
            list += `<button type="submit" class="btn btn-light favourite-button"><i class="bi bi-heart" style="color:#dc3545;"></i> +Favourite </button>
            </div>
          </div>`;
          }
        });
      }
      // append all meals found to meal div
      resultCardsContainer.innerHTML = list;
    });
  }


// To display recipe details
function getRecipeDetails(event) {
    if (event.target.classList.contains("recipe-button")) {
      // mainContainer.setAttribute('style','background-color:yellow')
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
    </div>
    `;
  mealDetailsContainer.innerHTML = content;
  mealDetailsContainer.parentElement.classList.add("show-recipe");
}


// To close recipe details
function closeRecipeDetails(){
  mealDetailsContainer.parentElement.classList.remove("show-recipe");
}

// add meals to favourites
function addToFavourites(event) {
// check if user has clicked on favourite button
  // if user has not clicked on favourite button just return
  if (!event.target.classList.contains("favourite-button")) {
    return;
  }
  let mealId = event.target.parentElement.id;
  let favouriteMeals;
  if (localStorage.getItem("favourites") === null) {
    favouriteMeals = [];
  } else {
    favouriteMeals = JSON.parse(localStorage.getItem("favourites"));
  }
  // check if the mealId is already present
  if (favouriteMeals.indexOf(mealId) !== -1) {
    return;
  }
  // add id to array and save it back to local storage
  favouriteMeals.push(mealId);
  localStorage.setItem("favourites", JSON.stringify(favouriteMeals));
  event.target.classList.remove("favourite-button");
  event.target.classList.remove("btn-light");
  event.target.classList.add("btn-danger");
  event.target.classList.add("added-button");
  // Added to Favourites btn
  event.target.innerHTML = `<a href="./favourite/favourite.html" style="text-decoration:none; color:inherit;"><i class="bi bi-heart-fill" style="color:#f0f0dd;"></i> Favourite </a></a></button>`
}