const searchForm = document.querySelector(".search-form");
const searchInput = document.querySelector("#game-search");
const categoryFilter = document.querySelector("#category-filter");
const freeToPlayCheckbox = document.querySelector("#free-to-play");
const searchResult = document.querySelector("#search-result");
const gameCards = document.querySelectorAll(".game-grid > article");


searchForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const searchTerm = searchInput.value.trim();
  const selectedCategory = categoryFilter.value;
  const freeToPlayOnly = freeToPlayCheckbox.checked;

  const normalizedSearchTerm = searchTerm.toLowerCase();

  let visibleGameCount = 0;

  gameCards.forEach(function (gameCard) {
    const gameTitle = gameCard
      .querySelector("h3")
      .textContent.toLowerCase();

      const gameCategory = gameCard.dataset.category;

      const matchesSearch = gameTitle.includes(normalizedSearchTerm);

      const matchesCategory =
        selectedCategory === "" || gameCategory === selectedCategory;

    const matchesAllFilters = matchesSearch && matchesCategory;

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

  searchResult.textContent = resultMessage;
});

searchForm.addEventListener("reset", function () {
  searchResult.textContent = "";

  gameCards.forEach(function(gameCard){
    gameCard.hidden = false;
  });
});