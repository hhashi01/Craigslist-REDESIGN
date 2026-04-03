const hamburger = document.getElementById('hamburger');
const drawer = document.getElementById('drawer');
const overlay = document.getElementById('overlay');
 
function openDrawer() {
  drawer.classList.add('active');
  overlay.classList.add('active');
}
 
function closeDrawer() {
  drawer.classList.remove('active');
  overlay.classList.remove('active');
}
 
hamburger.addEventListener('click', openDrawer);
overlay.addEventListener('click', closeDrawer);
document.getElementById('drawerClose').addEventListener('click', closeDrawer);