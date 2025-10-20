// Task 2 Part 1 
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