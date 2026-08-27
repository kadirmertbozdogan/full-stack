const searchForm = document.querySelector(".search-form");
const searchInput = document.querySelector("#game-search");
const categoryFilter = document.querySelector("#category-filter");
const freeToPlayCheckbox = document.querySelector("#free-to-play");
const searchResult = document.querySelector("#search-result");
const gameCards = document.querySelectorAll(".game-grid > article");
const totalGames = document.querySelector("#total-games");
const totalCategories = document.querySelector("#total-categories");
const freePercentage = document.querySelector("#free-percentage");
const categoryButtons = document.querySelectorAll(".category-button");
const sortGamesSelect = document.querySelector("#sort-games");
const gameGrids = document.querySelectorAll(".game-grid");
const savedFavoriteGames =
  JSON.parse(localStorage.getItem("favoriteGames")) || [];
const favoriteCount = document.querySelector("#favorite-count");
const favoritesOnlyCheckbox = document.querySelector("#favorites-only");
const gameDetailsDialog =
  document.querySelector("#game-details-dialog");

const closeGameDialogButton =
  document.querySelector("#close-game-dialog");

const gameDialogTitle =
  document.querySelector("#game-dialog-title");

const gameDialogDescription =
  document.querySelector("#game-dialog-description");

const gameDialogCategory =
  document.querySelector("#game-dialog-category");

const gameDialogAvailability =
  document.querySelector("#game-dialog-availability");

const gameDialogImage =
  document.querySelector("#game-dialog-image");

const themeToggleButton =
  document.querySelector("#theme-toggle");

const pageRoot =
  document.documentElement;

const savedTheme =
  localStorage.getItem("preferredTheme");

if (savedTheme === "light") {
  pageRoot.dataset.theme = "light";

  themeToggleButton.setAttribute(
    "aria-pressed",
    "true"
  );
} else {
  pageRoot.removeAttribute("data-theme");

  themeToggleButton.setAttribute(
    "aria-pressed",
    "false"
  );
}

  const favoriteGames = new Set(savedFavoriteGames);

function updateFavoriteButton(favoriteButton, isFavorite) {
  favoriteButton.classList.toggle(
    "is-favorite",
    isFavorite
  );

  favoriteButton.setAttribute(
    "aria-pressed",
    String(isFavorite)
  );

  if (isFavorite) {
    favoriteButton.textContent = "♥ Favorited";
  } else {
    favoriteButton.textContent = "♡ Favorite";
  }
}

function updateFavoriteCount() {
  favoriteCount.textContent = favoriteGames.size;
}

gameCards.forEach(function (gameCard) {
  const gameTitle = gameCard
    .querySelector("h3")
    .textContent;

  const gameDescription = gameCard
    .querySelector("p")
    .textContent;

  const gameCategory =
    gameCard.dataset.category;

  const isFreeToPlay =
    gameCard.dataset.free === "true";

  const gameImage =
    gameCard.querySelector("img");

  const gameImageSource =
    gameImage.src;

  const gameImageAlt =
    gameImage.alt;

  const favoriteButton =
    document.createElement("button");

  favoriteButton.type = "button";
  favoriteButton.classList.add("favorite-button");

  const detailsButton =
  document.createElement("button");

  detailsButton.type = "button";
  detailsButton.classList.add("details-button");
  detailsButton.textContent = "View Details";

  const isSavedFavorite =
    favoriteGames.has(gameTitle);

  updateFavoriteButton(
    favoriteButton,
    isSavedFavorite
  );

  favoriteButton.addEventListener("click", function () {
    const isFavorite =
      !favoriteGames.has(gameTitle);

    if (isFavorite) {
      favoriteGames.add(gameTitle);
    } else {
      favoriteGames.delete(gameTitle);
    }

    localStorage.setItem(
      "favoriteGames",
      JSON.stringify(Array.from(favoriteGames))
    );

    updateFavoriteCount();

    updateFavoriteButton(
      favoriteButton,
      isFavorite
    );

    filterGames();
  });


  detailsButton.addEventListener("click", function () {
    gameDialogTitle.textContent =
      gameTitle;

    gameDialogDescription.textContent =
      gameDescription;

    const formattedCategory =
      gameCategory.charAt(0).toUpperCase() +
      gameCategory.slice(1);

    gameDialogCategory.textContent =
      formattedCategory;

    if (isFreeToPlay) {
      gameDialogAvailability.textContent =
        "Free to Play";
    } else {
      gameDialogAvailability.textContent =
        "Paid";
    }

    gameDialogImage.src =
      gameImageSource;

    gameDialogImage.alt =
      gameImageAlt;

    gameDetailsDialog.showModal();
  });

  gameCard.append(detailsButton);
  gameCard.append(favoriteButton);
});

updateFavoriteCount();

gameGrids.forEach(function (gameGrid) {
  const cardsInGrid = gameGrid.querySelectorAll("article");

  cardsInGrid.forEach(function (gameCard, index) {
    gameCard.dataset.originalOrder = index;
  });
});

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

function updateActiveCategoryButton(selectedCategory) {
  categoryButtons.forEach(function (categoryButton) {
    const isActive =
      categoryButton.dataset.category === selectedCategory;

    categoryButton.classList.toggle("is-active", isActive);
    categoryButton.setAttribute("aria-pressed", isActive);
  });
}

function sortGameCards(sortOrder) {
  gameGrids.forEach(function (gameGrid) {
    const cardsInGrid = Array.from(
      gameGrid.querySelectorAll("article")
    );

    cardsInGrid.sort(function (firstCard, secondCard) {
      if (sortOrder === "default") {
        return (
          Number(firstCard.dataset.originalOrder) -
          Number(secondCard.dataset.originalOrder)
        );
      }

      const firstIsFeatured =
        firstCard.classList.contains("featured");

      const secondIsFeatured =
        secondCard.classList.contains("featured");

      if (firstIsFeatured) {
        return -1;
      }

      if (secondIsFeatured) {
        return 1;
      }

      const firstTitle = firstCard
        .querySelector("h3")
        .textContent;

      const secondTitle = secondCard
        .querySelector("h3")
        .textContent;

      if (sortOrder === "a-z") {
        return firstTitle.localeCompare(secondTitle);
      }

      return secondTitle.localeCompare(firstTitle);
    });

    cardsInGrid.forEach(function (gameCard) {
      gameGrid.append(gameCard);
    });
  });
}

function filterGames() {

  const searchTerm = searchInput.value.trim();
  const selectedCategory = categoryFilter.value;
  const freeToPlayOnly = freeToPlayCheckbox.checked;
  const favoritesOnly = favoritesOnlyCheckbox.checked;

  let normalizedSearchTerm = "";

  if (searchTerm.length >= 2) {
    normalizedSearchTerm = searchTerm.toLowerCase();
  }

  let visibleGameCount = 0;

  gameCards.forEach(function (gameCard) {
    const gameTitle = gameCard
    .querySelector("h3")
    .textContent;

  const normalizedGameTitle = gameTitle.toLowerCase();

      const gameCategory = gameCard.dataset.category;

      const isFreeToPlay = gameCard.dataset.free === "true";

      const matchesSearch = normalizedGameTitle.includes(normalizedSearchTerm);

      const matchesCategory = selectedCategory === "" || gameCategory === selectedCategory;

      const matchesFreeToPlay = !freeToPlayOnly || isFreeToPlay;

      const matchesFavorites = !favoritesOnly || favoriteGames.has(gameTitle);

      const gameImage =
        gameCard.querySelector("img");

      const gameImageSource =
        gameImage.src;

      const gameImageAlt =
        gameImage.alt;

      const matchesAllFilters =
      matchesSearch &&
      matchesCategory &&
      matchesFreeToPlay &&
      matchesFavorites;

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

  if (favoritesOnly) {
    resultMessage += " | Favorites only";
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

categoryFilter.addEventListener("change", function () {
  updateActiveCategoryButton(categoryFilter.value);
  filterGames();
});

freeToPlayCheckbox.addEventListener("change", filterGames);
favoritesOnlyCheckbox.addEventListener("change", filterGames);
searchInput.addEventListener("input", filterGames);

categoryButtons.forEach(function (categoryButton) {
  categoryButton.addEventListener("click", function () {
    const selectedButtonCategory = categoryButton.dataset.category;

    categoryFilter.value = selectedButtonCategory;
    updateActiveCategoryButton(selectedButtonCategory);
    filterGames();
  });
});

updateActiveCategoryButton(categoryFilter.value);

searchForm.addEventListener("reset", function () {
  searchResult.textContent = "";
  updateActiveCategoryButton("");
  sortGameCards("default");

  gameCards.forEach(function(gameCard){
    gameCard.hidden = false;
  });
});

sortGamesSelect.addEventListener("change", function () {
  sortGameCards(sortGamesSelect.value);
});

closeGameDialogButton.addEventListener(
  "click",
  function () {
    gameDetailsDialog.close();
  }
);

gameDetailsDialog.addEventListener(
  "click",
  function (event) {
    if (event.target === gameDetailsDialog) {
      gameDetailsDialog.close();
    }
  }
);

themeToggleButton.addEventListener(
  "click",
  function () {
    const isLightTheme =
      pageRoot.dataset.theme === "light";

    if (isLightTheme) {
      pageRoot.removeAttribute("data-theme");
    } else {
      pageRoot.dataset.theme = "light";
    }

    const lightThemeIsActive =
      pageRoot.dataset.theme === "light";

    themeToggleButton.setAttribute(
      "aria-pressed",
      String(lightThemeIsActive)
    );
    localStorage.setItem(
      "preferredTheme",
      lightThemeIsActive ? "light" : "dark"
    );
  }
);