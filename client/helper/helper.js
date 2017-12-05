//post error when error
const handleError = (message) => {
  $("#errorMessage").text(message);
};

//go to new spot
const redirect = (response) => {
  window.location = response.redirect;
};

//make ajax calls
const sendAjax = (type, action, data, success) => {
  $.ajax({
    cache: 'false',
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function(xhr, status, error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};