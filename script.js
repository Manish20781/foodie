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
let cache={};

function createCard(data){
  const div=document.createElement("div");
  div.classList.add("card");
  
  const img=document.createElement("img");
  img.src=data.strMealThumb || data.strCategoryThumb;
  img.alt=data.strMeal || data.strCategory;
  img.loading="lazy";
  
  const h3=document.createElement("h3");
  h3.textContent=data.strMeal || data.strCategory;
  
  div.appendChild(img);
  div.appendChild(h3);
  
  if(data.strInstructions){
    div.style.cursor="pointer";
    div.addEventListener("click",()=>{
      showDetail(data);
    });
  }
  
  return div;
}

function showDetail(data){
  main.innerHTML="";
  const card=document.createElement("div");
  card.className="card";
  card.innerHTML=`
    <img src="${data.strMealThumb}" alt="${data.strMeal}" loading="lazy">
    <h2>${data.strMeal}</h2>
    <p style="padding:15px">${data.strInstructions}</p>
    <button style="padding:10px 20px;margin:10px;border:none;background:#ff512f;color:white;border-radius:20px;cursor:pointer;">Go Back</button>
  `;
  card.querySelector("button").addEventListener("click",()=>location.reload());
  main.appendChild(card);
}

/* ================= SEARCH ================= */
async function searchMeal(){
  const name=document.getElementById("searchItem").value.trim();
  if(name===""){
    alert("Please enter meal name");
    return;
  }
  
  if(cache[name]){
    displayCards(cache[name]);
    return;
  }
  
  main.innerHTML="<h2 style='text-align:center'>Loading...</h2>";
  
  try{
    const resp=await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`);
    const data=await resp.json();
    
    if(data.meals){
      cache[name]=data.meals;
      displayCards(data.meals);
    }else{
      main.innerHTML="<h2 style='text-align:center'>No Meal Found 😢</h2>";
    }
  }catch(error){
    main.innerHTML="<h2 style='text-align:center'>Error fetching data</h2>";
  }
}

function displayCards(meals){
  main.innerHTML="";
  const fragment=document.createDocumentFragment();
  meals.forEach(meal=>fragment.appendChild(createCard(meal)));
  main.appendChild(fragment);
}

/* ================= RANDOM ================= */
async function loadRandomMeals(){
  main.innerHTML="<h2 style='text-align:center'>Loading Random Meals...</h2>";
  
  const promises=[];
  for(let i=0;i<6;i++){
    promises.push(fetch("https://www.themealdb.com/api/json/v1/1/random.php").then(r=>r.json()));
  }
  
  try{
    const results=await Promise.all(promises);
    const fragment=document.createDocumentFragment();
    results.forEach(data=>fragment.appendChild(createCard(data.meals[0])));
    main.innerHTML="";
    main.appendChild(fragment);
  }catch(error){
    main.innerHTML="<h2 style='text-align:center'>Error loading meals</h2>";
  }
}

/* ================= CATEGORIES ================= */
async function loadCategories(){
  if(cache.categories){
    displayCards(cache.categories);
    return;
  }
  
  main.innerHTML="<h2 style='text-align:center'>Loading Categories...</h2>";
  
  try{
    const resp=await fetch("https://www.themealdb.com/api/json/v1/1/categories.php");
    const data=await resp.json();
    
    cache.categories=data.categories;
    const fragment=document.createDocumentFragment();
    data.categories.forEach(cat=>fragment.appendChild(createCard(cat)));
    main.innerHTML="";
    main.appendChild(fragment);
  }catch(error){
    main.innerHTML="<h2 style='text-align:center'>Error loading categories</h2>";
  }
}