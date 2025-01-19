const sortOptions = document.querySelectorAll('input[name="sort"]');

sortOptions.forEach((option) => {
  option.addEventListener("change", async (e) => {
    const sortOption = e.target.value;
    window.location.href = `/?sort=${sortOption}`;
  });
});
