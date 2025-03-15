(function () {
  const mobileMenuButtonInside = document.getElementById(
    "mobile-menu-button__inside"
  );
  const mobileMenuButtonOutside = document.getElementById(
    "mobile-menu-button__outside"
  );

  const mobileMenu = document.getElementById("mobile-menu");

  mobileMenuButtonInside.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
  });

  mobileMenuButtonOutside.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
  });
})();
