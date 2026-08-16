const searchForm = document.querySelector(".search-form");
const searchInput = document.querySelector("#game-search");
const categoryFilter = document.querySelector("#category-filter");
const freeToPlayCheckbox = document.querySelector("#free-to-play");
const searchResult = document.querySelector("#search-result");

searchForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const searchTerm = searchInput.value.trim();
  const selectedCategory = categoryFilter.value;
  const freeToPlayOnly = freeToPlayCheckbox.checked;

  console.log("Search term:", searchTerm);
  console.log("Selected category:", selectedCategory);
  console.log("Free to play only:", freeToPlayOnly);

  let resultMessage = `Searching for: ${searchTerm}`;

  if (selectedCategory !== "") {
    resultMessage += `  | Category: ${selectedCategory}`;
  }

  if (freeToPlayOnly) {
    resultMessage += ` | Free to Play only`;
  }

  searchResult.textContent = resultMessage;
});

searchForm.addEventListener("reset", function() {
    searchResult.textContent = "";
});