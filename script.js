/* ================= HAMBURGER MENU ================= */
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");

if(hamburger){
  hamburger.addEventListener("click", ()=>{
    navLinks.classList.toggle("active");
  });

  // Close menu when a link is clicked
  const links = navLinks.querySelectorAll("a");
  links.forEach(link => {
    link.addEventListener("click", ()=>{
      navLinks.classList.remove("active");
    });
  });
}

const main=document.getElementById("main");

function createCard(data){
const div=document.createElement("div");
div.classList.add("card");

div.innerHTML=`
<img src="${data.strMealThumb || data.strCategoryThumb}" alt="${data.strMeal || data.strCategory} - Food recipe image" loading="lazy">
<h3>${data.strMeal || data.strCategory}</h3>
`;

if(data.strInstructions){
div.addEventListener("click",()=>{
main.innerHTML=`
<div class="card">
<img src="${data.strMealThumb}" alt="${data.strMeal} - detailed recipe image" loading="lazy">
<h2>${data.strMeal}</h2>
<p style="padding:15px">${data.strInstructions}</p>
<button onclick="location.reload()" style="padding:10px 20px;margin:10px;border:none;background:#ff512f;color:white;border-radius:20px;cursor:pointer;">Go Back</button>
</div>
`;
});
}

main.appendChild(div);
}

/* ================= SEARCH ================= */

async function searchMeal(){
const name=document.getElementById("searchItem").value.trim();
if(name===""){
alert("Please enter meal name");
return;
}
main.innerHTML="<h2 style='text-align:center'>Loading...</h2>";

try{
const resp=await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`);
const data=await resp.json();
main.innerHTML="";
if(data.meals){
data.meals.forEach(meal=>createCard(meal));
}else{
main.innerHTML="<h2 style='text-align:center'>No Meal Found 😢</h2>";
}
}catch(error){
main.innerHTML="<h2 style='text-align:center'>Error fetching data</h2>";
}
}

/* ================= RANDOM ================= */

async function loadRandomMeals(){
main.innerHTML="<h2 style='text-align:center'>Loading Random Meals...</h2>";
main.innerHTML="";
for(let i=0;i<6;i++){
const resp=await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
const data=await resp.json();
createCard(data.meals[0]);
}
}

/* ================= CATEGORIES ================= */

async function loadCategories(){
main.innerHTML="<h2 style='text-align:center'>Loading Categories...</h2>";

try{
const resp=await fetch("https://www.themealdb.com/api/json/v1/1/categories.php");
const data=await resp.json();
main.innerHTML="";
data.categories.forEach(cat=>createCard(cat));
}catch(error){
main.innerHTML="<h2 style='text-align:center'>Error loading categories</h2>";
}
}