const logoutBtn = document.querySelectorAll(".logout");
const deleteBtn = document.querySelectorAll(".deleteBtn");
const searchBar = document.getElementById("searchBar");
const searchResults = document.getElementById("searchResults");
const likeButton = document.querySelectorAll(".likeButton");

const socketUrl =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://simple-blog-xbox.onrender.com/";

const socket = io(socketUrl);

logoutBtn.forEach((button) => {
  button.addEventListener("click", async () => {
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
  searchResults.style.display = "block";
  if (!query.length) {
    searchResults.innerHTML = "";
    searchResults.style.display = "none";
    return;
  }
  try {
    const response = await fetch(`/search?query=${query}`);
    const result = await response.json();
    searchResults.innerHTML = result
      .map(
        (user) =>
          `
          <li class="searchItem">
            <div class="searchContainer">
              <div class="searchPic">
                <img src="${user.profilePic}">
              </div>
              <a href="/profile/${user.username}">${user.username}</a>
            </div>
          </li>
        `
      )
      .join("");
  } catch (err) {
    console.error(err);
  }
});

socket.on("blogLikeChange", ({ blogId, blogLikes }) => {
  const button = document.querySelector(`button[data-id="${blogId}"]`);
  if (button) {
    button.textContent = `Likes: ${blogLikes}`;
  }
});

likeButton.forEach((button) => {
  button.addEventListener("click", async (e) => {
    const blogId = button.getAttribute("data-id");
    try {
      const response = await fetch("/blogs/likes", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ blogId }),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.likeStatus) {
          e.target.classList.add("likedButton");
        } else {
          e.target.classList.remove("likedButton");
        }
      } else {
        console.error("Failed to update likes");
      }
    } catch (error) {
      console.error(error);
    }
  });
});
