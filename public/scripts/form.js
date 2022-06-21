

var overlay = document.querySelector('.form-overlay');
var frmBG1 = document.querySelector('.form-background-1');
var click = false;
function addProjectToggle() {
overlay.classList.toggle('active');
frmBG1.classList.toggle('active');
document.addBooking.reset();
}