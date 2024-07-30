// get the id from params on page load, to fetch the meal corresponding to that id
document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get('id');
    fetchMealDetails(userId)
});

/**
 * method to asyncronously fetch data corresponding to id
 * @param {string} id 
 */
async function fetchMealDetails(id){
 try {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
    const {meals} = await response.json()
    // console.log('meals: ',meals[0]);
    showingMealInDetail(meals[0])
 } catch (error) {
    console.error('something bad happens during data fetching');
 }
}

/**
 * method dynamically creating html elements and displaying data into it
 * @param {Object} meal 
 */
function showingMealInDetail(meal){
    const {strMeal, strDrinkAlternate, strCategory, strArea, strTags, strMealThumb, strYoutube, strInstructions} = meal;

    document.getElementById('mealName').textContent = strMeal
    const mealDetails = document.getElementById('mealDetails');

    mealDetails.innerHTML = `
        <header>
            <div class="heroImg">
                <img src=${strMealThumb} alt=${strMeal} >
            </div>
            <div class='textInfo'>
                <p>Popularity : <span>${strArea}</span></p> 
                <p>Category : <span>${strCategory}</span></p>
                ${strDrinkAlternate ? `<p>drink alternative : <span>${strDrinkAlternate}</span></p>` : ''}
                ${strTags ? `<p>Tags : <span>${strTags}</span></p>` : ''}
                <a href=${strYoutube}>Youtube link </a> 
            </div>
        </header>
        <section>
            <h4>Steps to cook this delicious meal for you love ones.</h4>
            <ol id="instructions">

            </ol>
            
        </section>
    `

    ingredients(strInstructions)
}

/**
 * method to dynamically creating html element and displaying the data into it
 * @param {String} instructions 
 */
function ingredients(instructions){
    const ol = document.getElementById('instructions')
    instructions.split('.').forEach(instruct => {
        if(!instruct) {
            return;
        }
        const li = document.createElement('li')
        li.textContent = instruct + '.'
        ol.appendChild(li)
    });
}