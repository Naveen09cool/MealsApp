let searchTextElement = document.getElementById("search-meal-input");
const searchBtn = document.getElementById("search-btn");
const resultCardsContainer = document.getElementById("cards-container");
// const mealDetailsCard = document.getElementById("meal-details-card");
// const backButton = document.getElementsByClassName("back-button")[0];


// EVENTS For Seraching MEAL
searchBtn.addEventListener("click", searchMealFunc);
searchTextElement.addEventListener("input", searchMealFunc);

resultCardsContainer.addEventListener("click", getRecipeDetails);
mealSearchResultsContainer.addEventListener("click", addToFavourites);


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
            <div class="card" id="meal-details-card" style="width: 18rem;">
                <img src="${meal.strMealThumb}" class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title">${meal.strMeal}</h5>
                    <a href="#" class="btn btn-primary">Get Recipe</a>
                    <button type="submit" class="btn btn-danger favourite-button"> + Favourite </button>
                </div>
            </div>
            `;
          });
        }
        // append all meals found to meal div
        resultCardsContainer.innerHTML = list;
      });
  }

  function getRecipeDetails(event) {
    if (event.target.classList.contains("recipe-button")) {
      let mealItem = event.target.parentElement.parentElement;
      const mealId = mealItem.id;
      fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
        .then((response) => response.json())
        .then((data) => addRecipeDetail(data.meals[0]));
    }
  }