const searchForm = document.querySelector(".search-form");
const searchInput = document.querySelector("#game-search");
const categoryFilter = document.querySelector("#category-filter");
const freeToPlayCheckbox = document.querySelector("#free-to-play");
const searchResult = document.querySelector("#search-result");
const gameCards = document.querySelectorAll(".game-grid > article");
const totalGames = document.querySelector("#total-games");
const totalCategories = document.querySelector("#total-categories");
const freePercentage = document.querySelector("#free-percentage");

function updateStatistics() {

  totalGames.textContent = gameCards.length;

  const uniqueCategories = new Set();

  gameCards.forEach(function(gameCard){
    uniqueCategories.add(gameCard.dataset.category);
  });

  totalCategories.textContent = uniqueCategories.size;

  let freeGameCount = 0;

  gameCards.forEach(function(gameCard){
  if (gameCard.dataset.free === "true") {
    freeGameCount += 1;
  }

});

const freeGamePercentage = Math.round(
  (freeGameCount / gameCards.length) * 100
);

freePercentage.textContent = `${freeGamePercentage}%`;

}

updateStatistics();

function filterGames() {

  const searchTerm = searchInput.value.trim();
  const selectedCategory = categoryFilter.value;
  const freeToPlayOnly = freeToPlayCheckbox.checked;

  let normalizedSearchTerm = "";

  if (searchTerm.length >= 2) {
    normalizedSearchTerm = searchTerm.toLowerCase();
  }

  let visibleGameCount = 0;

  gameCards.forEach(function (gameCard) {
    const gameTitle = gameCard
      .querySelector("h3")
      .textContent.toLowerCase();

      const gameCategory = gameCard.dataset.category;

      const isFreeToPlay = gameCard.dataset.free === "true";

      const matchesSearch = gameTitle.includes(normalizedSearchTerm);

      const matchesCategory =
        selectedCategory === "" || gameCategory === selectedCategory;

      const matchesFreeToPlay = !freeToPlayOnly || isFreeToPlay;

    const matchesAllFilters =
      matchesSearch && matchesCategory && matchesFreeToPlay;

    if (matchesAllFilters) {
      visibleGameCount += 1;
    }

    gameCard.hidden = !matchesAllFilters;
  });

  let resultMessage = `Searching for: ${searchTerm}`;

  if (selectedCategory !== "") {
    resultMessage += ` | Category: ${selectedCategory}`;
  }

  if (freeToPlayOnly) {
    resultMessage += " | Free to Play only";
  }

  resultMessage += ` | Result: ${visibleGameCount}`;

  if (searchTerm.length == 1) {
    resultMessage = "Enter at least 2 characters.";
  } else if (visibleGameCount === 0) {
    resultMessage = "No games found.";
  }

  searchResult.textContent = resultMessage;
}

searchForm.addEventListener("submit", function(event){
  event.preventDefault();
  filterGames();
});

categoryFilter.addEventListener("change", filterGames);
freeToPlayCheckbox.addEventListener("change", filterGames);
searchInput.addEventListener("input", filterGames);

searchForm.addEventListener("reset", function () {
  searchResult.textContent = "";

  gameCards.forEach(function(gameCard){
    gameCard.hidden = false;
  });
});