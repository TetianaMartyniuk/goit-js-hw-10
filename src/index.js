import './css/styles.css';
import { debounce } from 'lodash';
import { Notify } from 'notiflix';

const DEBOUNCE_DELAY = 300;
 
const refs = {
    searchBox: document.querySelector("#search-box"),
    countryList: document.querySelector(".country-list"),
    countryInfo: document.querySelector(".country-info")
};
const { searchBox, countryList, countryInfo } = refs;

// https://restcountries.com/v3.1/name/{name}

// Напиши функцію fetchCountries(name), яка робить HTTP - запит на ресурс name і повертає 
// проміс з масивом країн - результатом запиту. 
// Винеси її в окремий файл fetchCountries.js і зроби іменований експорт.
searchBox.addEventListener("input", debounce(fetchCountries, DEBOUNCE_DELAY))

function fetchCountries(event) {
    cleanList();
    const name = event.target.value.trim();
    if (!name) {
        return
    }
    // console.log(name);
    fetch(`https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flags,languages`)
        .then((response) => { 
            if (!response.ok) {
                throw new Error(response.status);
            }
            return response.json();
        }).then((response) => { checkingListOfCountries(response);         
        }).catch((error) => {
            Notify.failure("Oops, there is no country with that name"); console.log("Error:", error)
        });
    
}


function renderCountryList(countries) {
    // console.log(countries);
    let markup = countries.map((country) => {
        const languages = Object.values(country.languages).map((lang) => { return lang }).join(", ");
        // console.log(languages);
            return `<li class="country">
                    <h2><img class="flag" src="${country.flags.svg}" width="30"></svg><span>${country.name.official}</span></h2>
                    </li>`
        }).join("");
    countryList.innerHTML = markup;
}

function renderCountryCard(countries) {
    // console.log(countries);
    let markup = countries.map((country) => {
         const languages = Object.values(country.languages).map((lang) => { return lang }).join(", ");
        // console.log(languages);
        return `<li class="country card">
                    <h2><img class="flag" src="${country.flags.svg}" width="30"></svg><span>${country.name.official}</span></h2>
                    <p><b>Capital:</b> ${country.capital}</p>
                    <p><b>Population:</b> ${country.population} per.</p>
                    <p><b>Languages:</b> ${languages}</p>
                    </li>`}).join("")
    countryInfo.innerHTML = markup;
}

function cleanList() {
    countryList.innerHTML = "";
    countryInfo.innerHTML = "";
}

function checkingListOfCountries(response) {
    if (response.length > 10) {
                Notify.info("Too many matches found. Please enter a more specific name.")
                return
            }
            if (response.length > 1 && response.length < 10) {
                renderCountryList(response)
                return
            }
            if (response.length === 1) {
                renderCountryCard(response)
                return
            }
}

// function showInfoAboutCountry (country){
    
// }


