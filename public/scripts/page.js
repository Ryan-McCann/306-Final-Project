document.addEventListener("DOMContentLoaded", () => {
    let loggedInDropdown = document.getElementById("loggedin-dropdown");
    let loggedOutDropdown = document.getElementById("loggedout-dropdown");
    
    fetch('/loggedin')
    .then(res => res.json())
    .then(data => {
        if(data.loggedIn) {
            loggedInDropdown.hidden = false;
            loggedOutDropdown.hidden = true;
        } else {
            loggedInDropdown.hidden = true;
            loggedOutDropdown.hidden = false;
        }
    });
    
    let logoutLink = document.getElementById("logoutLink");
    logoutLink.addEventListener("click", () => {
        fetch('/logout', { method: 'POST' })
          .then(() => {
            console.log('Logged out. Reloading...');
            window.location.reload();
          });
    });
});

let prevScrollPos = window.pageYOffset;

window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    const currentScrollPos = window.pageYOffset;
    
    if(prevScrollPos > currentScrollPos)
        navbar.classList.remove('navbar-hidden');
    else
        navbar.classList.add('navbar-hidden');
    
    prevScrollPos = currentScrollPos;
});