const sideBar = document.querySelector(".sideBar");
const menuOpen = document.getElementById("menuOpen");
const menuClose = document.getElementById("menuClose");

menuOpen.addEventListener("click", () => {
    sideBar.style.display = "flex";
});

menuClose.addEventListener("click", () => {
    sideBar.style.display = "none";
});