let currentPage = 1;
const itemsPerPage = 10;
let filteredImages = [];

function showArtwork(element) {
  const largeImage = document.getElementById("largeImage");
  const title = document.getElementById("title");
  const description = document.getElementById("description");

  largeImage.src = element.src;

  const id = element.dataset.id;
  const info = artworkDescriptions[id];

  if(info) {
    title.textContent = info.title || "Untitled";
    description.textContent = info.description || "";
  } else {
    title.textContent = "Bon Appetit";
    description.textContent = "";
  }
  
}

// Open fullscreen when clicking the preview image
document.getElementById("largeImage").addEventListener("click", function () {
  const fullImg = document.getElementById("fullscreenImage");
  fullImg.src = this.src;
  document.getElementById("fullscreenOverlay").style.display = "flex";
});

// Close fullscreen on overlay click
function closeFullscreen() {
  document.getElementById("fullscreenOverlay").style.display = "none";
}

// Hamburger menu toggle
function toggleMenu() {
  const menu = document.getElementById("navMenu");
  const hamburger = document.getElementById("hamburger");

  const isOpen = menu.style.display === "flex";
  menu.style.display = isOpen ? "none" : "flex";
  hamburger.classList.toggle("open", !isOpen);
}

// Close menu when clicking outside
document.addEventListener("click", function (event) {
  const menu = document.getElementById("navMenu");
  const hamburger = document.getElementById("hamburger");

  const isClickInsideMenu = menu.contains(event.target);
  const isClickOnHamburger = hamburger.contains(event.target);

  if (!isClickInsideMenu && !isClickOnHamburger) {
    menu.style.display = "none";
    hamburger.classList.remove("open");
  }
});

// Filter images by tag and reset pagination
function filterByTag(tag, buttonElement) {
  const allImages = document.querySelectorAll(".gallery img");
  filteredImages = [];

  allImages.forEach(img => {
    const match = tag === "All" || img.dataset.tag === tag;
    img.style.display = match ? "block" : "none";
    if (match) filteredImages.push(img);
  });

  currentPage = 1;
  paginateGallery();

  if (filteredImages.length > 0) {
    showArtwork(filteredImages[0]);
  }
  
  // 🔥 Highlight active tag

  const allButtons = document.querySelectorAll(".tag-btn");
  allButtons.forEach(btn => btn.classList.remove("active-tag"));
  if (buttonElement) {
    buttonElement.classList.add("active-tag");
  
  }
}

// Paginate visible (filtered) images
function paginateGallery() {
  if (filteredImages.length === 0) {
    filteredImages = Array.from(document.querySelectorAll(".gallery img"))
      .filter(img => img.style.display !== "none");
  }

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  filteredImages.forEach((img, index) => {
    img.style.display = (index >= startIndex && index < endIndex) ? "block" : "none";
  });

  const totalPages = Math.ceil(filteredImages.length / itemsPerPage);
  document.getElementById("prevBtn").style.display = currentPage > 1 ? "inline-block" : "none";
  document.getElementById("nextBtn").style.display = currentPage < totalPages ? "inline-block" : "none";
}

function nextPage() {
  const totalPages = Math.ceil(filteredImages.length / itemsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    paginateGallery();
    autoSelectFirstVisible();
  }
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    paginateGallery();
    autoSelectFirstVisible();
  }
}

function autoSelectFirstVisible() {
  const visible = filteredImages.find(img => img.style.display !== "none");
  if (visible) showArtwork(visible);
}

// Initialize on page load
window.addEventListener("DOMContentLoaded", function () {
  const allImages = document.querySelectorAll(".gallery img");
  filteredImages = Array.from(allImages);

  if (filteredImages.length > 0) {
    showArtwork(filteredImages[0]);
  }

  paginateGallery();
});

let artworkDescriptions = {};

fetch('descriptions.json')
  .then(res => res.json())
  .then(data => {
    artworkDescriptions = data;
  });