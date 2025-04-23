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