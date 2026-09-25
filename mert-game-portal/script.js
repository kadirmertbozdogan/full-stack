const searchForm =
  document.querySelector(".search-form");

const searchInput =
  document.querySelector("#game-search");

const categoryFilter =
  document.querySelector("#category-filter");

const freeToPlayCheckbox =
  document.querySelector("#free-to-play");

const searchResult =
  document.querySelector("#search-result");

const gameCards =
  document.querySelectorAll(".game-grid > article");

const totalGames =
  document.querySelector("#total-games");

const totalCategories =
  document.querySelector("#total-categories");

const freePercentage =
  document.querySelector("#free-percentage");

const categoryButtons =
  document.querySelectorAll(".category-button");

const sortGamesSelect =
  document.querySelector("#sort-games");

const gameGrids =
  document.querySelectorAll(".game-grid");

const favoriteCount =
  document.querySelector("#favorite-count");

const favoritesOnlyCheckbox =
  document.querySelector("#favorites-only");

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

const recentGamesList =
  document.querySelector("#recent-games");

const recentEmptyMessage =
  document.querySelector("#recent-empty");

const clearRecentGamesButton =
  document.querySelector(
    "#clear-recent-games"
  );

const pageRoot =
  document.documentElement;

const savedFavoriteGames =
  JSON.parse(
    localStorage.getItem("favoriteGames")
  ) || [];

const favoriteGames =
  new Set(savedFavoriteGames);

let recentlyViewedGames =
  JSON.parse(
    localStorage.getItem("recentlyViewedGames")
  ) || [];

const savedTheme =
  localStorage.getItem("preferredTheme");

const toastMessage =
  document.querySelector("#toast-message");

const emptyState =
  document.querySelector("#empty-state");

const resetEmptyStateButton =
  document.querySelector("#reset-empty-state");

const copyFilterLinkButton =
  document.querySelector(
    "#copy-filter-link"
  );

const activeFiltersSection =
  document.querySelector("#active-filters");

const activeFilterList =
  document.querySelector("#active-filter-list");

let toastTimeoutId;
let toastUpdateTimeoutId;
let searchDebounceId;

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

function updateFavoriteButton(
  favoriteButton,
  isFavorite
) {
  favoriteButton.classList.toggle(
    "is-favorite",
    isFavorite
  );

  favoriteButton.setAttribute(
    "aria-pressed",
    String(isFavorite)
  );

  if (isFavorite) {
    favoriteButton.textContent =
      "♥ Favorited";
  } else {
    favoriteButton.textContent =
      "♡ Favorite";
  }
}

function showToast(message) {
  clearTimeout(toastTimeoutId);
  clearTimeout(toastUpdateTimeoutId);

  const isAlreadyVisible =
    toastMessage.classList.contains(
      "is-visible"
    );

  if (isAlreadyVisible) {
    toastMessage.classList.remove(
      "is-visible"
    );
  }

  const updateDelay =
    isAlreadyVisible ? 250 : 0;

  toastUpdateTimeoutId = setTimeout(
    function () {
      toastMessage.textContent =
        message;

      toastMessage.classList.add(
        "is-visible"
      );

      toastTimeoutId = setTimeout(
        function () {
          toastMessage.classList.remove(
            "is-visible"
          );
        },
        2500
      );
    },
    updateDelay
  );
}

function updateFavoriteCount() {
  favoriteCount.textContent =
    favoriteGames.size;
}

function renderRecentlyViewedGames() {
  recentGamesList.innerHTML = "";

  recentEmptyMessage.hidden =
    recentlyViewedGames.length > 0;

  clearRecentGamesButton.hidden =
    recentlyViewedGames.length === 0;

  recentlyViewedGames.forEach(
    function (gameTitle) {
      const listItem =
        document.createElement("li");

      const recentGameButton =
        document.createElement("button");

      recentGameButton.type = "button";

      recentGameButton.classList.add(
        "recent-game-button"
      );

      recentGameButton.textContent =
        gameTitle;

      recentGameButton.addEventListener(
        "click",
        function () {
          const matchingGameCard =
            Array.from(gameCards).find(
              function (gameCard) {
                const cardTitle =
                  gameCard
                    .querySelector("h3")
                    .textContent;

                return (
                  cardTitle === gameTitle
                );
              }
            );

          if (matchingGameCard) {
            const matchingDetailsButton =
              matchingGameCard.querySelector(
                ".details-button"
              );

            matchingDetailsButton.click();
          }
        }
      );

      listItem.append(recentGameButton);
      recentGamesList.append(listItem);
    }
  );
}

function addRecentlyViewedGame(gameTitle) {
  recentlyViewedGames =
    recentlyViewedGames.filter(
      function (savedGameTitle) {
        return savedGameTitle !== gameTitle;
      }
    );

  recentlyViewedGames.unshift(gameTitle);

  recentlyViewedGames =
    recentlyViewedGames.slice(0, 5);

  localStorage.setItem(
    "recentlyViewedGames",
    JSON.stringify(recentlyViewedGames)
  );

  renderRecentlyViewedGames();
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

  favoriteButton.classList.add(
    "favorite-button"
  );

  const detailsButton =
    document.createElement("button");

  detailsButton.type = "button";

  detailsButton.classList.add(
    "details-button"
  );

  detailsButton.textContent =
    "View Details";

  const isSavedFavorite =
    favoriteGames.has(gameTitle);

  updateFavoriteButton(
    favoriteButton,
    isSavedFavorite
  );



  favoriteButton.addEventListener(
    "click",
    function () {
      const isFavorite =
        !favoriteGames.has(gameTitle);

      if (isFavorite) {
        favoriteGames.add(gameTitle);
      } else {
        favoriteGames.delete(gameTitle);
      }

      localStorage.setItem(
        "favoriteGames",
        JSON.stringify(
          Array.from(favoriteGames)
        )
      );

      updateFavoriteCount();

      updateFavoriteButton(
        favoriteButton,
        isFavorite
      );

      const favoriteMessage =
        isFavorite
          ? `${gameTitle} added to favorites.`
          : `${gameTitle} removed from favorites.`;

      showToast(favoriteMessage);

      filterGames();
    }
  );

  detailsButton.addEventListener(
    "click",
    function () {
      gameDialogTitle.textContent =
        gameTitle;

      gameDialogDescription.textContent =
        gameDescription;

      const formattedCategory =
        gameCategory
          .charAt(0)
          .toUpperCase() +
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

      addRecentlyViewedGame(gameTitle);

      gameDetailsDialog.showModal();
    }
  );

  gameCard.append(detailsButton);
  gameCard.append(favoriteButton);
});

updateFavoriteCount();

gameGrids.forEach(function (gameGrid) {
  const cardsInGrid =
    gameGrid.querySelectorAll("article");

  cardsInGrid.forEach(
    function (gameCard, index) {
      gameCard.dataset.originalOrder =
        index;
    }
  );
});

function updateStatistics() {
  totalGames.textContent =
    gameCards.length;

  const uniqueCategories =
    new Set();

  gameCards.forEach(function (gameCard) {
    uniqueCategories.add(
      gameCard.dataset.category
    );
  });

  totalCategories.textContent =
    uniqueCategories.size;

  let freeGameCount = 0;

  gameCards.forEach(function (gameCard) {
    if (
      gameCard.dataset.free === "true"
    ) {
      freeGameCount += 1;
    }
  });

  const freeGamePercentage =
    Math.round(
      (freeGameCount / gameCards.length) *
        100
    );

  freePercentage.textContent =
    `${freeGamePercentage}%`;
}

updateStatistics();

function updateActiveCategoryButton(
  selectedCategory
) {
  categoryButtons.forEach(
    function (categoryButton) {
      const isActive =
        categoryButton.dataset.category ===
        selectedCategory;

      categoryButton.classList.toggle(
        "is-active",
        isActive
      );

      categoryButton.setAttribute(
        "aria-pressed",
        String(isActive)
      );
    }
  );
}

function compareGameCards(
  firstCard,
  secondCard,
  sortOrder
) {
  if (sortOrder === "default") {
    return (
      Number(
        firstCard.dataset.originalOrder
      ) -
      Number(
        secondCard.dataset.originalOrder
      )
    );
  }

  const firstIsFeatured =
    firstCard.classList.contains(
      "featured"
    );

  const secondIsFeatured =
    secondCard.classList.contains(
      "featured"
    );

  if (
    firstIsFeatured &&
    !secondIsFeatured
  ) {
    return -1;
  }

  if (
    !firstIsFeatured &&
    secondIsFeatured
  ) {
    return 1;
  }

  const firstTitle = firstCard
    .querySelector("h3")
    .textContent;

  const secondTitle = secondCard
    .querySelector("h3")
    .textContent;

  if (sortOrder === "a-z") {
    return firstTitle.localeCompare(
      secondTitle
    );
  }

  return secondTitle.localeCompare(
    firstTitle
  );
}

function sortGameCards(sortOrder) {
  gameGrids.forEach(function (gameGrid) {
    const cardsInGrid =
      Array.from(
        gameGrid.querySelectorAll(
          "article"
        )
      );

      cardsInGrid.sort(
        function (
          firstCard,
          secondCard
        ) {
          return compareGameCards(
            firstCard,
            secondCard,
            sortOrder
          );
        }
      );
    cardsInGrid.forEach(
      function (gameCard) {
        gameGrid.append(gameCard);
      }
    );
  });
}

function updateGameSections() {
  gameGrids.forEach(function (gameGrid) {
    const gameSection =
      gameGrid.closest("section");

    const cardsInGrid = Array.from(
      gameGrid.querySelectorAll("article")
    );

    const hasVisibleGame =
      cardsInGrid.some(function (gameCard) {
        return !gameCard.hidden;
      });

    gameSection.hidden =
      !hasVisibleGame;
  });
}

function getFilterState() {
  return Object.freeze({
    searchTerm:
      searchInput.value.trim(),

    selectedCategory:
      categoryFilter.value,

    freeToPlayOnly:
      freeToPlayCheckbox.checked,

    favoritesOnly:
      favoritesOnlyCheckbox.checked,

    sortOrder:
      sortGamesSelect.value
  });
}

function updateUrlFromFilters(
  filterState = getFilterState()
) {
  const urlParameters =
    new URLSearchParams();

  const {
    searchTerm,
    selectedCategory,
    freeToPlayOnly,
    favoritesOnly,
    sortOrder
  } = filterState;

  if (searchTerm.length >= 2) {
    urlParameters.set(
      "search",
      searchTerm
    );
  }

  if (selectedCategory !== "") {
    urlParameters.set(
      "category",
      selectedCategory
    );
  }

  if (freeToPlayOnly) {
    urlParameters.set(
      "free",
      "true"
    );
  }

  if (favoritesOnly) {
    urlParameters.set(
      "favorites",
      "true"
    );
  }

  if (sortOrder !== "default") {
    urlParameters.set(
      "sort",
      sortOrder
    );
  }

  const queryString =
    urlParameters.toString();

  let newUrl =
    window.location.pathname;

  if (queryString !== "") {
    newUrl += `?${queryString}`;
  }

  window.history.replaceState(
    null,
    "",
    newUrl
  );
}

function loadFiltersFromUrl() {
  const urlParameters =
    new URLSearchParams(
      window.location.search
    );

  const savedSearch =
    urlParameters.get("search");

  const savedCategory =
    urlParameters.get("category");

  const savedSort =
    urlParameters.get("sort");

  const validCategories = [
    "action",
    "racing",
    "puzzle"
  ];

  const validSortOrders = [
    "a-z",
    "z-a"
  ];

  if (
    savedSearch !== null &&
    savedSearch.length >= 2
  ) {
    searchInput.value =
      savedSearch;
  }

  if (
    validCategories.includes(
      savedCategory
    )
  ) {
    categoryFilter.value =
      savedCategory;
  }

  freeToPlayCheckbox.checked =
    urlParameters.get("free") === "true";

  favoritesOnlyCheckbox.checked =
    urlParameters.get("favorites") === "true";

  if (
    validSortOrders.includes(
      savedSort
    )
  ) {
    sortGamesSelect.value =
      savedSort;
  }

  updateActiveCategoryButton(
    categoryFilter.value
  );

  sortGameCards(
    sortGamesSelect.value
  );

  filterGames();
}

function getGameData(gameCard) {
  const gameTitle = gameCard
    .querySelector("h3")
    .textContent;

  return Object.freeze({
    gameTitle,

    normalizedGameTitle:
      gameTitle.toLowerCase(),

    gameCategory:
      gameCard.dataset.category,

    isFreeToPlay:
      gameCard.dataset.free === "true",

      isFavorite:
      favoriteGames.has(gameTitle)
  });
}

function gameMatchesFilters(
  gameData,
  filterState
) {
  const {
    normalizedGameTitle,
    gameCategory,
    isFreeToPlay,
    isFavorite
  } = gameData;

  const {
    searchTerm,
    selectedCategory,
    freeToPlayOnly,
    favoritesOnly
  } = filterState;

  let normalizedSearchTerm = "";

  if (searchTerm.length >= 2) {
    normalizedSearchTerm =
      searchTerm.toLowerCase();
  }

  const matchesSearch =
    normalizedGameTitle.includes(
      normalizedSearchTerm
    );

  const matchesCategory =
    selectedCategory === "" ||
    gameCategory === selectedCategory;

  const matchesFreeToPlay =
    !freeToPlayOnly || isFreeToPlay;

  const matchesFavorites =
    !favoritesOnly || isFavorite;

  return (
    matchesSearch &&
    matchesCategory &&
    matchesFreeToPlay &&
    matchesFavorites
  );
}

function filterGames() {
  const filterState =
  getFilterState();

  const {
    searchTerm,
    selectedCategory,
    freeToPlayOnly,
    favoritesOnly
} = filterState;

  let normalizedSearchTerm = "";

  if (searchTerm.length >= 2) {
    normalizedSearchTerm =
      searchTerm.toLowerCase();
  }

  let visibleGameCount = 0;

  gameCards.forEach(function (gameCard) {

  const gameData =
    getGameData(gameCard);

  const matchesAllFilters =
    gameMatchesFilters(
      gameData,
      filterState
    );

    if (matchesAllFilters) {
      visibleGameCount += 1;
    }

    gameCard.hidden =
      !matchesAllFilters;
  });

  emptyState.hidden =
  visibleGameCount !== 0;

  updateGameSections();

  let resultMessage =
    `Searching for: ${searchTerm}`;

  if (selectedCategory !== "") {
    resultMessage +=
      ` | Category: ${selectedCategory}`;
  }

  if (freeToPlayOnly) {
    resultMessage +=
      " | Free to Play only";
  }

  if (favoritesOnly) {
    resultMessage +=
      " | Favorites only";
  }

  resultMessage +=
    ` | Result: ${visibleGameCount}`;

  if (searchTerm.length === 1) {
    resultMessage =
      "Enter at least 2 characters.";
  } else if (visibleGameCount === 0) {
    resultMessage =
      "No games found.";
  }

  searchResult.textContent =
    resultMessage;

  renderActiveFilters(filterState);
  updateUrlFromFilters(filterState);
}

function createActiveFilterChip(
  label,
  filterName
) {
  const filterButton =
    document.createElement("button");

  filterButton.type = "button";

  filterButton.classList.add(
    "active-filter-chip"
  );

  filterButton.dataset.filter =
    filterName;

  filterButton.textContent =
    label;

  filterButton.setAttribute(
    "aria-label",
    `Remove ${label}`
  );

  activeFilterList.append(
    filterButton
  );
}

function renderActiveFilters(
  filterState = getFilterState()
) {
  activeFilterList.replaceChildren();

  const {
    searchTerm,
    selectedCategory,
    freeToPlayOnly,
    favoritesOnly,
    sortOrder
  } = filterState;

  if (searchTerm.length >= 2) {
    createActiveFilterChip(
      `Search: ${searchTerm}`,
      "search"
    );
  }

  if (selectedCategory !== "") {
    const categoryName =
      categoryFilter
        .selectedOptions[0]
        .textContent;

    createActiveFilterChip(
      `Category: ${categoryName}`,
      "category"
    );
  }

  if (freeToPlayOnly) {
    createActiveFilterChip(
      "Free to Play",
      "free"
    );
  }

if (favoritesOnly) {
    createActiveFilterChip(
      "Favorites Only",
      "favorites"
    );
  }

  if (sortOrder !== "default") {
    const sortName =
      sortGamesSelect
        .selectedOptions[0]
        .textContent;

    createActiveFilterChip(
      `Sort: ${sortName}`,
      "sort"
    );
  }

  activeFiltersSection.hidden =
    activeFilterList.childElementCount === 0;
}

function handleSearchInput() {
  clearTimeout(searchDebounceId);

  searchDebounceId = setTimeout(
    function () {
      filterGames();
    },
    300
  );
}

searchForm.addEventListener(
  "submit",
  function (event) {
    event.preventDefault();

    clearTimeout(searchDebounceId);
    filterGames();
  }
);

categoryFilter.addEventListener(
  "change",
  function () {
    updateActiveCategoryButton(
      categoryFilter.value
    );

    filterGames();
  }
);

freeToPlayCheckbox.addEventListener(
  "change",
  filterGames
);

favoritesOnlyCheckbox.addEventListener(
  "change",
  filterGames
);

searchInput.addEventListener(
  "input",
  handleSearchInput
);

categoryButtons.forEach(
  function (categoryButton) {
    categoryButton.addEventListener(
      "click",
      function () {
        const selectedButtonCategory =
          categoryButton.dataset.category;

        categoryFilter.value =
          selectedButtonCategory;

        updateActiveCategoryButton(
          selectedButtonCategory
        );

        filterGames();
      }
    );
  }
);

updateActiveCategoryButton(
  categoryFilter.value
);



updateGameSections();

sortGamesSelect.addEventListener(
  "change",
  function () {
    sortGameCards(
      sortGamesSelect.value
    );

    updateUrlFromFilters();
  }
);

closeGameDialogButton.addEventListener(
  "click",
  function () {
    gameDetailsDialog.close();
  }
);

gameDetailsDialog.addEventListener(
  "click",
  function (event) {
    if (
      event.target ===
      gameDetailsDialog
    ) {
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
      pageRoot.removeAttribute(
        "data-theme"
      );
    } else {
      pageRoot.dataset.theme =
        "light";
    }

    const lightThemeIsActive =
      pageRoot.dataset.theme === "light";

    themeToggleButton.setAttribute(
      "aria-pressed",
      String(lightThemeIsActive)
    );

    localStorage.setItem(
      "preferredTheme",
      lightThemeIsActive
        ? "light"
        : "dark"
    );

  const themeMessage =
    lightThemeIsActive
      ? "Light theme activated."
      : "Dark theme activated.";

  showToast(themeMessage);
  }
);

copyFilterLinkButton.addEventListener(
  "click",
  async function () {
    clearTimeout(searchDebounceId);
    filterGames();

    try {
      await navigator.clipboard.writeText(
        window.location.href
      );

      showToast(
        "Filter link copied."
      );
    } catch (error) {
      showToast(
        "Could not copy filter link."
      );

      console.error(
        "Could not copy filter link:",
        error
      );
    }
  }
);

activeFilterList.addEventListener(
  "click",
  function (event) {
    const filterButton =
      event.target.closest(
        ".active-filter-chip"
      );

    if (filterButton === null) {
      return;
    }

    const filterButtonsBefore =
      Array.from(
        activeFilterList.querySelectorAll(
          ".active-filter-chip"
        )
      );

    const removedFilterIndex =
      filterButtonsBefore.indexOf(
        filterButton
      );

    const filterName =
      filterButton.dataset.filter;

    const removedFilterLabel =
      filterButton.textContent;

    if (filterName === "search") {
      clearTimeout(searchDebounceId);
      searchInput.value = "";
    } else if (filterName === "category") {
      categoryFilter.value = "";

      updateActiveCategoryButton("");
    } else if (filterName === "free") {
      freeToPlayCheckbox.checked = false;
    } else if (filterName === "favorites") {
      favoritesOnlyCheckbox.checked = false;
    } else if (filterName === "sort") {
      sortGamesSelect.value = "default";

      sortGameCards("default");
    }

    filterGames();

    const filterButtonsAfter =
      Array.from(
        activeFilterList.querySelectorAll(
          ".active-filter-chip"
        )
      );

    const nextFilterButton =
      filterButtonsAfter[
        removedFilterIndex
      ] ||
      filterButtonsAfter[
        removedFilterIndex - 1
      ];

    if (nextFilterButton) {
      nextFilterButton.focus();
    } else {
      searchInput.focus();
    }

    showToast(
      `${removedFilterLabel} removed.`
    );
  }
);

clearRecentGamesButton.addEventListener(
  "click",
  function () {
    recentlyViewedGames = [];

    localStorage.removeItem(
      "recentlyViewedGames"
    );

    renderRecentlyViewedGames();

    showToast(
      "Recently viewed history cleared."
    );
  }
);

function resetFilters() {
  clearTimeout(searchDebounceId);

  searchInput.value = "";
  categoryFilter.value = "";
  freeToPlayCheckbox.checked = false;
  favoritesOnlyCheckbox.checked = false;
  sortGamesSelect.value = "default";

  searchResult.textContent = "";

  updateActiveCategoryButton("");
  sortGameCards("default");

  gameCards.forEach(function (gameCard) {
    gameCard.hidden = false;
  });

  emptyState.hidden = true;

  updateGameSections();
  renderActiveFilters();
  updateUrlFromFilters();
}

document.addEventListener(
  "keydown",
  function (event) {
    const eventTarget =
      event.target;

    const userIsTyping =
      eventTarget.tagName === "INPUT" ||
      eventTarget.tagName === "TEXTAREA" ||
      eventTarget.tagName === "SELECT" ||
      eventTarget.isContentEditable;

    const dialogIsOpen =
      gameDetailsDialog.open;

    if (
      event.key === "/" &&
      !userIsTyping &&
      !dialogIsOpen
    ) {
      event.preventDefault();
      searchInput.focus();
      return;
    }

    if (
      event.key === "Escape" &&
      eventTarget === searchInput &&
      searchInput.value !== "" &&
      !dialogIsOpen
    ) {
      event.preventDefault();

      clearTimeout(searchDebounceId);

      searchInput.value = "";

      filterGames();

      showToast(
        "Search cleared."
      );
    }
  }
);

searchForm.addEventListener("reset", function (event) {
  event.preventDefault();
  resetFilters();
});

resetEmptyStateButton.addEventListener(
  "click",
  resetFilters
);

renderRecentlyViewedGames();
loadFiltersFromUrl();