const warning = document.getElementById('warning')

function closeWarning() {
    warning.style.background = "#fff";
    warning.style.left = "-5000px";
    setTimeout(() =>  warning.style.display = "none", 600);
   

}

