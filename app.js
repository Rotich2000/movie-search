const form = document.querySelector(".js-search-form");
const icon = document.querySelector(".js-search-icon");

const handleSubmit = async (e) => {
  e.preventDefault();
  //   get the input from the user.
  const inputValue = document.querySelector(".js-search-input").value;
  //   remove the white spaces
  const searchQuery = inputValue.trim();

  const searchResults = document.querySelector(".home-content");
  searchResults.innerHTML = "";

  const spinner = document.querySelector(".spinner");
  spinner.classList.remove("hidden");

  try {
    const results = await searchOmdbMovies(searchQuery);
    const movies = await fetchAdditionalData(results);
    displayResults(movies);
  } catch (error) {
    // console.log(error);
    alert("Failed to search");
  } finally {
    spinner.classList.add("hidden");
  }
};

// Fetch additional data from the API.
const fetchAdditionalData = async (results) => {
  const moviePromises = results.Search.map(async (result) => {
    const apiUrl = `http://www.omdbapi.com/?i=tt3896198&apikey=bfc7603d&t=${result.Title}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
  });
  return Promise.all(moviePromises);
};

const searchOmdbMovies = async (query) => {
  const key = `http://www.omdbapi.com/?i=tt3896198&apikey=bfc7603d&s=${query}&t=${query}`;
  const response = await fetch(key);

  if (!response.ok) {
    throw new Error(response.statusText);
  }
  const json = await response.json();
  return json;
};

const displayResults = (results) => {
  const container = document.querySelector(".home-content");
  let htmlContent = "";
  console.log(results);
  results.forEach((result) => {
    htmlContent += `
        <div class="home-content-card">
        <div class="home-content-img">
          <img src=${result.Poster} alt="home" />
        </div>
        <div class="home-content-img-details">
          <h2>${result.Title}</h2>
          <p class="release">Released: <span>${result.Year}</span></p>
          <div class="home-content-more">
            <p>
              <span>Plot:</span> ${result.Plot}
            </p>
            <p>
              <span>Cast:</span> ${result.Actors}
            </p>
            <p>
              <span>Genre:</span> ${result.Genre}
            </p>
          </div>
          <button class="btn">More</button>
        </div>
      </div>
        `;
  });
  container.innerHTML = htmlContent;

  //   expand the more button
  const buttons = container.querySelectorAll(".btn");
  buttons.forEach((button, index) => {
    const more = container.querySelectorAll(".home-content-more")[index];

    let isExpanded = false;
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      if (isExpanded) {
        more.classList.remove("expanded");
        button.textContent = "More";
      } else {
        more.classList.add("expanded");
        button.textContent = "Less";
      }

      isExpanded = !isExpanded;
    });
  });
  // end
};

form.addEventListener("submit", handleSubmit);
icon.addEventListener("click", handleSubmit);
