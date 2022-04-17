
const warning = document.getElementById('warning');

function closeWarning() {
    warning.style.background = "#fff";
    warning.style.left = "-5000px";
    setTimeout(() => warning.style.display = "none", 600);
}
function openMenu() {
    document.getElementById("menu").classList.toggle("menu-open");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.burger-menu')) {

    let dropdowns = document.getElementsByClassName("menu");
                   
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('menu-open')) {
        openDropdown.classList.remove('menu-open');
      }
    }
  }
}



$(function () {
    $("#tagCloud a").tagcloud({
        size: {
            start: 12,
            end: 36,
            unit: "px"
        },
        color: {
            start: '#889099',
            end: '#000'
        }

    });
});