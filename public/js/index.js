const logoutBtn = document.getElementById("logoutBtn");
const deleteBtn = document.querySelectorAll(".deleteBtn");
const searchBar = document.getElementById("searchBar");
const searchResults = document.getElementById("searchResults");

logoutBtn.addEventListener("click", async () => {
  try {
    const response = await fetch("/logout", { method: "POST" });
    const message = await response.text();
    if (response.ok) {
      console.log(message, response.statusText);
      window.location.href = "/login";
    } else {
      console.error(message);
    }
  } catch (err) {
    console.error("an error ocuured during logout:", err);
  }
});

deleteBtn.forEach((button) => {
  button.addEventListener("click", async () => {
    const blogId = button.getAttribute("data-blogId");
    const response = await fetch("/profile", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ blogId }),
    });
    const result = await response.json();
    if (response.ok) {
      console.log(result.message);
      const parentElement = button.closest(".blogBox");
      parentElement.remove();
    } else {
      console.error(result.message);
    }
  });
});

searchBar.addEventListener("input", async (event) => {
  const query = event.target.value.trim();
  searchResults.style.display= "block";
  if (!query.length) {
    searchResults.innerHTML = "";
    searchResults.style.display= "none";
    return;
  }
  try {
    const response = await fetch(`/search?query=${query}`);
    const result = await response.json();
    searchResults.innerHTML = result
      .map((user) =>
        `
          <li class="searchItem">
            <a href="/profile/${user.username}">${user.username}</a>
          </li>
        `
      )
      .join("");
  } catch (err) {
    console.error(err);
  }
});
