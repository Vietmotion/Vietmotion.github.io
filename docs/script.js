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

