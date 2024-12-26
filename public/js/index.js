const logoutBtn = document.getElementById("logoutBtn");

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
