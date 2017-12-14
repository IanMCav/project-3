//initialize application
const setup = function(csrf, e) {
  const changePWButton = document.querySelector("#pwChangeButton");
  const homeButton = document.querySelector("#homeButton");
  const profileButton = document.querySelector("#profileButton");
  const searchButton = document.querySelector("#searchButton");
  
  profileButton.addEventListener("click", (e) => {
    e.preventDefault();
    createProfileWindow(csrf);
    return false;
  });
  
  homeButton.addEventListener("click", (e) => {
    e.preventDefault();
    createHomeWindow();
    return false;
  });
  
  e.preventDefault();
  createHomeWindow();
  return false;
};

//prevent csrf. init app.
const getToken = () => {
  sendAjax("GET", '/getToken', null, (result) => {
    setup(result.csrfToken);
  });
};

$(document).ready(function() {
  getToken();
});