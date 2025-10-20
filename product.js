// Task 2 Part 1 By Madiyar
const btn = document.getElementById('btn-show-time');
const out = document.getElementById('time-output');

btn.addEventListener('click', () => {
  const now = new Date().toLocaleTimeString();
  out.textContent = "Current time: " + now;
});

//Task 2 Part 2
const nav = document.querySelector("nav");
const links = nav.querySelectorAll("a");
let index = 0;

nav.addEventListener("keydown", function(e) { //e - object(event)
    if (e.key === "ArrowRight") {
      index++;
      if (index >= links.length) index = 0;
      links[index].focus();
    }
  
    if (e.key === "ArrowLeft") {
      index--;
      if (index < 0) index = links.length - 1;
      links[index].focus();
    }
  });

//Task 2 Part 3

const slides = [ //array of objects 
    {t:'Tomatoes', d:'Fresh, ripe tomatoes.', img:'https://images-prod.healthline.com/hlcmsresource/images/AN_images/tomatoes-1296x728-feature.jpg'},
    {t:'Mozzarella', d:'Creamy mozzarella.', img:'https://cheesemaking.com/cdn/shop/products/mozzarella-cheese-recipe-1.jpg?v=1759251859&width=1200'},
    {t:'Basil', d:'Aromatic fresh basil.', img:'https://cdn-prod.medicalnewstoday.com/content/images/articles/266/266425/basil-in-a-bowel-on-a-table.jpg'},
    {t:'Pepperoni', d:'Spicy pepperoni.', img:'https://www.psseasoning.com/cdn/shop/articles/IMG_3904.jpg?v=1668536324&width=2000'}
  ];

let i = 0;
const img = document.getElementById('carousel-image');
const t  = document.getElementById('carousel-title');
const d  = document.getElementById('carousel-desc');
const step = document.getElementById('carousel-step');

function show(){
    img.src  = slides[i].img;
    img.alt  = slides[i].t;
    t.textContent = slides[i].t;
    d.textContent = slides[i].d;
    step.textContent = `Step ${i+1} of ${slides.length}`;
}

document.getElementById('carousel-next').onclick = ()=>{ i = (i+1)%slides.length; show(); }
document.getElementById('carousel-back').onclick = ()=>{ i = (i-1+slides.length)%slides.length; show(); }

document.getElementById('ingredients-carousel').onkeydown = (e)=>{
  if(e.key==='ArrowRight'){ i=(i+1)%slides.length; show(); }
  if(e.key==='ArrowLeft'){  i=(i-1+slides.length)%slides.length; show(); }
};

show(); 