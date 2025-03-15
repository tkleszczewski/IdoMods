(function () {
  const loadingStarterElement = document.getElementById("loading-starter");
  const pageSizeSelectElement = document.getElementById(
    "products-page-size-select"
  );
  const productsContainer = document.getElementById("products-container");
  const popoverElement = document.getElementById("product-popover");
  const popoverContentContainer = document.getElementById(
    "popover-content-container"
  );
  const popoverCloseButton = document.getElementById("popover-close-button");

  const API_URL = "https://brandstestowy.smallhost.pl/api/random";

  const intersectionOptions = {
    rootMargin: "0px",
    threshold: 1,
  };

  let pageSize = pageSizeSelectElement.value;
  let pageNumber = 1;
  let totalPages = Infinity;

  let isLoading = false;

  popoverCloseButton.addEventListener("click", () => {
    popoverElement.classList.toggle("hidden");
  });

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

  const renderPopover = (dataset) => {
    popoverElement.classList.toggle("hidden");
    const allElements = popoverContentContainer.querySelectorAll("*");

    allElements.forEach((element) => element.remove());

    const fragmentElement = new DocumentFragment();

    Object.entries(dataset).forEach(([key, value]) => {
      const keyValueElement = document.createElement("div");
      keyValueElement.classList.add("product-popover__keyvaluepair");
      keyValueElement.textContent = `${key}: ${value}`;

      fragmentElement.appendChild(keyValueElement);
    });

    popoverContentContainer.appendChild(fragmentElement);
  };

  const renderDataCells = (data) => {
    const fragmentElement = new DocumentFragment();

    for (let i = 0; i < data.length; i++) {
      const liElement = document.createElement("li");
      liElement.classList.add("products-list__list-item");

      const btnElement = document.createElement("button");
      btnElement.classList.add("products-list__list-item__item");
      btnElement.textContent = `Id: ${data[i].id}`;

      btnElement.dataset.id = data[i].id;
      btnElement.dataset.text = data[i].text;
      btnElement.dataset.image = data[i].image;

      btnElement.addEventListener("click", (e) => {
        renderPopover(e.target.dataset);
      });

      liElement.appendChild(btnElement);
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
