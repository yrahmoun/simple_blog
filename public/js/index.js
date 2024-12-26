const logoutBtn = document.getElementById("logoutBtn");
const deleteBtn = document.querySelectorAll(".deleteBtn");

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
