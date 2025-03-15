(function () {
  const loadingStarterElement = document.getElementById("loading-starter");
  const pageSizeSelectElement = document.getElementById(
    "products-page-size-select"
  );
  const productsContainer = document.getElementById("products-container");

  const API_URL = "https://brandstestowy.smallhost.pl/api/random";

  const intersectionOptions = {
    rootMargin: "0px",
    threshold: 1,
  };

  let pageSize = pageSizeSelectElement.value;
  let pageNumber = 1;
  let totalPages = Infinity;

  let isLoading = false;

  const renderShimmerCells = () => {
    const fragmentElement = new DocumentFragment();

    for (let i = 0; i < 8; i++) {
      const liElement = document.createElement("li");
      liElement.classList.add("products-list__list-item");

      const divElement = document.createElement("div");
      divElement.classList.add(
        "products-list__list-item__item",
        "shimmer-effect"
      );

      liElement.appendChild(divElement);
      fragmentElement.appendChild(liElement);
    }

    return fragmentElement;
  };

  const removeShimmerCells = () => {
    document
      .querySelectorAll(".shimmer-effect")
      .forEach((element) =>
        element.closest(".products-list__list-item").remove()
      );
  };

  const renderDataCells = (data) => {
    console.log(data);

    const fragmentElement = new DocumentFragment();

    for (let i = 0; i < data.length; i++) {
      const liElement = document.createElement("li");
      liElement.classList.add("products-list__list-item");

      const divElement = document.createElement("div");
      divElement.classList.add("products-list__list-item__item");
      divElement.textContent = `Id: ${data[i].id}`;

      liElement.appendChild(divElement);
      fragmentElement.appendChild(liElement);
    }

    return fragmentElement;
  };

  const removeAllDataCells = () => {
    document
      .querySelectorAll(".products-list__list-item")
      .forEach((element) => element.remove());
  };

  const fetchData = async (pageNumber, pageSize) => {
    isLoading = true;
    const response = await fetch(
      `${API_URL}?pageSize=${pageSize}&pageNumber=${pageNumber}`
    );

    const data = await response.json();
    return data;
  };

  const onIntersectionStart = async () => {
    if (isLoading || totalPages <= pageNumber) {
      return;
    }
    productsContainer.appendChild(renderShimmerCells());
    const { data, totalPages: tP } = await fetchData(pageNumber, pageSize);
    removeShimmerCells();
    productsContainer.appendChild(renderDataCells(data));
    pageNumber += 1;
    totalPages = tP;
    isLoading = false;
  };

  pageSizeSelectElement.addEventListener("change", (e) => {
    pageNumber = 1;
    pageSize = e.target.value;
    totalPages = Infinity;
    removeAllDataCells();
    onIntersectionStart();
  });

  const onLoadingStarterElementIntersection = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        onIntersectionStart();
      }
    });
  };

  const observer = new IntersectionObserver(
    onLoadingStarterElementIntersection,
    intersectionOptions
  );

  observer.observe(loadingStarterElement);
})();
