const inputSearch = document.querySelector("input");
const inputContainer = document.querySelector(".dropdown-container");

function showPredictions(repositories) {
    inputContainer.innerHTML = "";
    if(repositories.total_count === 0) inputContainer.innerHTML += `<p>Ничего не найдено</p>`;

    for (let repositoryIndex = 0; repositoryIndex < 10; repositoryIndex++) {

        let name = repositories.items[repositoryIndex].name;
        let link = repositories.items[repositoryIndex].svn_url;
        let stars = repositories.items[repositoryIndex].stargazers_count;
        let desc = repositories.items[repositoryIndex].description;

        let dropdownContent = `
            <div class="dropdown-content">
                <ul>
                    <li>Repository: <a href=${link} target="_blank">${name}</a></li>
                    <li>Rating stars: ${stars}</li>
                    <li>Description: ${desc}</li>
                </ul>
            </div>
        `;

        inputContainer.innerHTML += dropdownContent;
    }
}

async function getPredictions() {

    const urlSearchRepositories = new URL("https://api.github.com/search/repositories");
    let repositoriesPart = (inputSearch.value).trim();
    if(repositoriesPart.length == 1) {
        inputContainer.innerHTML = "";
        inputContainer.innerHTML += `<p>Минимальное количество символов для поиска 2!</p>`;
        return;
    } else {
        if (repositoriesPart == "") {
            inputContainer.innerHTML = "";
            inputContainer.innerHTML += `<p>Начните поиск!</p>`;
            return;
        }
    
        urlSearchRepositories.searchParams.append("q", repositoriesPart)
    
        try {
            let response = await fetch(urlSearchRepositories);
            if (response.ok) {
                let repositories = await response.json();
                showPredictions(repositories);
            }
        else showPredictions(false);
        } catch(error) {
            return null;
        }
    }
}

function debounce(fn, timeout) {
    let timer = null;

    return (...args) => {
	    clearTimeout(timer);
	    return new Promise((resolve) => {
	        timer = setTimeout(
		        () => resolve(fn(...args)),
		        timeout
	        );
	    });
    };
}

const getPredictionsDebounce = debounce(getPredictions, 500);
inputSearch.addEventListener("input", getPredictionsDebounce);
