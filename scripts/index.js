(function () {
  const loadingStarterElement = document.getElementById("loading-starter");
  const pageSizeSelectElement = document.getElementById(
    "products-page-size-select"
  );

  const intersectionOptions = {
    rootMargin: "0px",
    threshold: 0.5,
  };

  const onIntersectionStart = () => {
    console.log("intersection started");
  };

  const onIntersectionEnd = () => {
    console.log("intersection ended");
  };

  const onLoadingStarterElementIntersection = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        onIntersectionStart();
      } else {
        onIntersectionEnd();
      }
    });
  };

  const observer = new IntersectionObserver(
    onLoadingStarterElementIntersection,
    intersectionOptions
  );

  observer.observe(loadingStarterElement);
})();
