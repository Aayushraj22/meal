let favouriteMeal = []
const mealResults = document.getElementById('mealResults')
let timeoutTimerId = null;

/**
 * fetchResult will be called on an input event, also i have used the debouncing concept to limit the api call for continuous api within some time duration.
 * @params null
 */ 
function fetchResult() {
    if(timeoutTimerId){
        clearTimeout(timeoutTimerId);
        timeoutTimerId = null;
    }

    timeoutTimerId = setTimeout(() => {
        fetchMeal()
    }, 500);
}

// window load event listener to again display the same result when came back to this page
window.addEventListener('load', () => {
    fetchMeal()
})

/**
 * fetchMeal method asynchronously fetching data from themealdb.com and then dynamically create elements to display them 
 * @params null 
 */
async function fetchMeal(){
    const searchedMeal = document.querySelector('#searchMeal').value
    mealResults.innerHTML = ''
    if(searchedMeal === '')
        return;
    
    mealResults.innerHTML = `<p>loading...</p>`
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchedMeal}`)
        const {meals} = await response.json()
        mealResults.innerHTML = ''
        meals.forEach((meal) => {
            mealResults.appendChild(mealCard(meal));
         })
    } catch (error) {
         mealResults.innerHTML = `<p> Sorry! does not process that, try other meal`
    }
}

/**
 * mealCard method to create individaul meal card to display the meal information
 * @param {Object} meal
 * @return html element
 *  */ 
function mealCard(meal){
    const {idMeal, strMeal, strMealThumb, } = meal
    const mealCard = document.createElement('div')
    mealCard.className = 'mealCard'

    // image element
    const imageCard = document.createElement('div')
    imageCard.className = 'imgCard'
    const image = document.createElement('img');
    image.src = strMealThumb
    image.setAttribute('alt', strMeal)
    imageCard.appendChild(image);

    // meal name and favourite button
    const desCard = document.createElement('div')
    desCard.className = 'desCard'
    const mealName = document.createElement('p')
    mealName.textContent = strMeal
    const links = document.createElement('div')
    links.className = 'links'
    const view = document.createElement('a')
    view.href = `view.html?id=${idMeal}`
    view.textContent = 'view'
    const favBtn = document.createElement('button')
    favBtn.textContent = 'add To Favourite'
    favBtn.addEventListener('click', (e) => {
        const button = e.target;
        button.className = 'favourite'
        addToFavourite(strMeal, favBtn)
    })

    links.append(view, favBtn);
    desCard.append(mealName, links);
    mealCard.append(imageCard, desCard);

    return mealCard;
 }


/**
 * on 'add to favourite' button click, this method adds the favourite meal into the favouriteMeal list
 */
function addToFavourite(mealName, btn) {
    favouriteMeal.push({mealName: mealName, btn: btn});
}

/**
 * on remove button click, this method to remove the meal from favouriteMeal list
 */
function toggleFavModal() {
    const modal = document.getElementById('modal')
    const ul = document.getElementById('favouriteMeals')
    ul.innerHTML = ''

    if(modal.style.display === 'block'){
        modal.style.display = 'none'
        return;
    } else {
        modal.style.display = 'block'
    } 

    favouriteMeal.forEach(meal => {
        const li = document.createElement('li')
        const p = document.createElement('p')
        p.textContent = meal.mealName
        li.appendChild(p)
        ul.appendChild(li);
        const deleteBtn = document.createElement('button')
        deleteBtn.textContent = 'Remove'
        deleteBtn.addEventListener('click', () => {
            favouriteMeal = favouriteMeal.filter((menu) => menu.mealName !== meal.mealName);
            meal.btn.classList.toggle('favourite')
            li.remove()
        })
        li.appendChild(deleteBtn)
    });
}

