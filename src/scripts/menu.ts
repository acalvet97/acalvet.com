document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");

  if (!menuToggle || !mobileMenu) {
    console.error("Required DOM elements not found");
    return;
  }

  const toggle = menuToggle as HTMLButtonElement;
  const menu = mobileMenu as HTMLElement;
  const bars = toggle.querySelectorAll('span');

  let isMenuOpen = false;

  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
    
    // Update ARIA state
    toggle.setAttribute('aria-expanded', isMenuOpen.toString());
    
    // Toggle menu position
    if (isMenuOpen) {
      menu.classList.remove('-translate-y-full');
      menu.classList.add('translate-y-0');
      
      // Transform to X with refined pixel-perfect center crossing
      bars[0].style.transform = 'rotate(45deg) translate(5.75px, 5.75px)';
      bars[1].style.opacity = '0';
      bars[2].style.transform = 'rotate(-45deg) translate(5.75px, -5.75px)';
    } else {
      menu.classList.remove('translate-y-0');
      menu.classList.add('-translate-y-full');
      
      // Reset to hamburger
      bars[0].style.transform = 'none';
      bars[1].style.opacity = '1';
      bars[2].style.transform = 'none';
    }
  }

  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === "Escape" && isMenuOpen) {
      toggleMenu();
    }
  };

  // Event Listeners
  toggle.addEventListener("click", toggleMenu);
  document.addEventListener("keydown", handleKeydown);

  // Cleanup function
  const cleanup = () => {
    toggle.removeEventListener("click", toggleMenu);
    document.removeEventListener("keydown", handleKeydown);
  };

  return cleanup;
});
