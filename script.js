let searchTextElement = document.getElementById("search-meal-input");
const searchBtn = document.getElementById("search-btn");
const resultCardsContainer = document.getElementById("cards-container");
const mealDetailsContainer = document.getElementById("meal-details-container");
const backButton = document.getElementsByClassName("back-button")[0];
const mainContainer  = document.getElementById("main-container");
// const mealDetailsCard = document.getElementById("meal-details-card");


// EVENTS For Seraching MEAL
searchBtn.addEventListener("click", searchMealFunc);
searchTextElement.addEventListener("input", searchMealFunc);
backButton.addEventListener("click", closeRecipeDetails);
resultCardsContainer.addEventListener("click", getRecipeDetails);
// resultCardsContainer.addEventListener("click", addToFavourites);


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
          <div class="card" style="width: 18rem;" id = "${meal.idMeal}">
              <img src="${meal.strMealThumb}" class="card-img-top" alt="...">
              <div class="card-body">
                  <h5 class="card-title">${meal.strMeal}</h5>
                  <a href="#" class="btn btn-primary recipe-button">Get Recipe</a>
                  <button type="submit" class="btn btn-danger favourite-button"> Favourite </button>
              </div>
          </div>
          `;
        });
      }
      // append all meals found to meal div
      resultCardsContainer.innerHTML = list;
    });
  }


// To display recipe details
function getRecipeDetails(event) {
    if (event.target.classList.contains("recipe-button")) {
      mainContainer.setAttribute('style','background-color:yellow')
      let mealItem = event.target.parentElement.parentElement;
      const mealId = mealItem.id;
      console.log(mealId);
      fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
      .then((response) => response.json())
      .then((data) => addRecipeDetail(data.meals[0]));
    }
  }


// function  to show recipe details
function addRecipeDetail(meal) {
  let content = `
    <h2 class = "recipe-title">${meal.strMeal}</h2>
    <div class = "recipe-meal-img">
        <img src = "${meal.strMealThumb}" alt = "">
    </div>
    <div class = "recipe-instructions">
        <p>${meal.strInstructions}</p>
    </div>
    `;
  mealDetailsContainer.innerHTML = content;
  mealDetailsContainer.parentElement.classList.add("show-recipe");
}


// To close recipe details
function closeRecipeDetails(){
  mainContainer.setAttribute('style','background-color:#e6e6e6')
  mealDetailsContainer.parentElement.classList.remove("show-recipe");
}