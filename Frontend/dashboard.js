
const items = document.querySelectorAll(".nav-item");
const indicator = document.querySelector(".indicator");

function moveIndicator(element) {
  indicator.style.left = element.offsetLeft + "px";
  indicator.style.width = element.offsetWidth + "px";
}


window.onload = () => {
  moveIndicator(items[0]);
};

items.forEach(item => {
  item.addEventListener("click", () => {
    moveIndicator(item);
  });
});

const map = L.map('map').setView([22.5937, 78.9629], 5);

// Load tiles (OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap'
}).addTo(map);

let marker;

// Search logic
const input = document.getElementById("searchBox");
const suggestions = document.getElementById("suggestions");

input.addEventListener("input", async () => {
  const query = input.value;

  if (!query) {
    suggestions.innerHTML = "";
    return;
  }

  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${query}&countrycodes=in&format=json`
  );

  const data = await res.json();

  suggestions.innerHTML = data
    .map(place => `
      <div class="item" data-lat="${place.lat}" data-lon="${place.lon}">
        ${place.display_name}
      </div>
    `)
    .join("");
});

// Click suggestion
suggestions.addEventListener("click", (e) => {
  if (!e.target.classList.contains("item")) return;

  const lat = e.target.dataset.lat;
  const lon = e.target.dataset.lon;
  const name = e.target.innerText;

  document.getElementById("placeName").innerText = name;

  // Move map
  map.setView([lat, lon], 12);

  // Add marker
  if (marker) map.removeLayer(marker);
  marker = L.marker([lat, lon]).addTo(map);

  suggestions.innerHTML = "";
});

// Save Plan
document.getElementById("saveBtn").addEventListener("click", () => {
  const place = document.getElementById("placeName").innerText;
  const people = document.getElementById("people").value;
  const budget = document.getElementById("budget").value;

  if (place === "None") {
    alert("Select a place first!");
    return;
  }

  alert(`Trip Planned!\nPlace: ${place}\nPeople: ${people}\nBudget: ₹${budget}`);
});