const sortOptions = document.querySelectorAll('input[name="sort"]');

sortOptions.forEach((option) => {
  option.addEventListener("change", async (e) => {
    const sortOption = e.target.value;
    const path = window.location.pathname;
    window.location.href = `${path}?sort=${sortOption}`;
  });
});
