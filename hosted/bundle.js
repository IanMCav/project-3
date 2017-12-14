"use strict";
"use strict";

var createHomeWindow = function createHomeWindow() {

  ReactDOM.render(React.createElement("div", null), document.querySelector("#header"));

  ReactDOM.render(React.createElement("div", null), document.querySelector("#form"));

  ReactDOM.render(React.createElement(HomeBody, null), document.querySelector("#content"));

  loadAllPosts();
};

var HomeBody = function HomeBody(props) {
  var homeNodes = props.content.map(function (post) {
    return React.createElement(
      "div",
      { key: post._id, className: "post" },
      React.createElement(
        "pre",
        null,
        React.createElement(
          "h1",
          null,
          post.author
        ),
        React.createElement(
          "p",
          null,
          post.contents
        )
      )
    );
  });

  return React.createElement(
    "div",
    { classNames: "homeBody" },
    postNodes
  );
};

var loadAllPosts = function loadAllPosts() {

  sendAjax("GET", "/home", null, function (data) {
    ReactDOM.render(React.createElement("homeBody", { content: data.content }), document.querySelector("#content"));
  });
};
"use strict";

//make a new post to the database
var handlePost = function handlePost(e) {
  e.preventDefault();

  if ($("#postValue").val() == '') {
    handleError("Your post cannot be as blank as your mind");
    return false;
  }

  sendAjax("POST", $("#postForm").attr("action"), $("#postForm").serialize(), function () {
    loadPostsFromServer();
  });

  return false;
};

//new profile blurb
var handleBlurb = function handleBlurb(e) {
  e.preventDefault();

  sendAjax("POST", $("#profile").attr("action"), $("#profile").serialize(), function () {
    loadProfileFromServer();
  });

  return false;
};

//profile for react
var Profile = function Profile(props) {
  return React.createElement(
    "form",
    { id: "profile",
      name: "profile",
      onSubmit: handleBlurb,
      action: "/blurb",
      method: "POST",
      className: "profile"
    },
    React.createElement(
      "h1",
      null,
      props.username
    ),
    React.createElement("textarea", { id: "blurbField", name: "theBlurb", value: props.blurb }),
    React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
    React.createElement("br", null),
    React.createElement("input", { className: "updateBlurb", type: "submit", value: "Update" })
  );
};

//form for react
var PostForm = function PostForm(props) {
  return React.createElement(
    "form",
    { id: "postForm",
      name: "postForm",
      onSubmit: handlePost,
      action: "/new",
      method: "POST",
      className: "postForm"
    },
    React.createElement(
      "h3",
      null,
      "Remember, 30 characters per line!"
    ),
    React.createElement("textarea", { id: "postValue", name: "thePost", placeholder: "Share your thoughts..." }),
    React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
    React.createElement("br", null),
    React.createElement("input", { className: "makePostSubmit", type: "submit", value: "Post!" })
  );
};

//all posts for react
var PostList = function PostList(props) {
  if (props.posts.length === 0) {
    return React.createElement(
      "div",
      { className: "postList" },
      React.createElement(
        "h3",
        { className: "emptyPost" },
        "No Posts yet"
      )
    );
  }

  var postNodes = props.posts.map(function (post) {
    return React.createElement(
      "div",
      { key: post._id, className: "post" },
      React.createElement(
        "pre",
        null,
        React.createElement(
          "p",
          null,
          post.contents
        )
      )
    );
  });

  return React.createElement(
    "div",
    { classNames: "postList" },
    postNodes
  );
};

var createProfileWindow = function createProfileWindow(csrf) {
  console.log('createProfile');

  ReactDOM.render(React.createElement(Profile, { csrf: csrf }), document.querySelector("#header"));

  ReactDOM.render(React.createElement(PostForm, { csrf: csrf }), document.querySelector("#form"));

  ReactDOM.render(React.createElement(PostList, { posts: [] }), document.querySelector("#content"));

  loadPostsFromServer();
};

//get the posts associated with your account
var loadPostsFromServer = function loadPostsFromServer() {

  sendAjax("GET", "/getPosts", null, function (data) {
    ReactDOM.render(React.createElement(PostList, { posts: data.posts }), document.querySelector("#content"));
  });
};

//get your account info- username, blurb. mostly blurb.
var loadProfileFromServer = function loadProfileFromServer() {
  console.log();
  sendAjax("GET", "/blurb", null, function (data) {
    ReactDOM.render(React.createElement(Profile, null), document.querySelector("#header"));
  });
};
"use strict";

//initialize application
var setup = function setup(csrf, e) {
  var changePWButton = document.querySelector("#pwChangeButton");
  var homeButton = document.querySelector("#homeButton");
  var profileButton = document.querySelector("#profileButton");
  var searchButton = document.querySelector("#searchButton");

  profileButton.addEventListener("click", function (e) {
    e.preventDefault();
    createProfileWindow(csrf);
    return false;
  });

  homeButton.addEventListener("click", function (e) {
    e.preventDefault();
    createHomeWindow();
    return false;
  });

  e.preventDefault();
  createHomeWindow();
  return false;
};

//prevent csrf. init app.
var getToken = function getToken() {
  sendAjax("GET", '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
"use strict";

//post error when error
var handleError = function handleError(message) {
  $("#errorMessage").text(message);
};

//go to new spot
var redirect = function redirect(response) {
  window.location = response.redirect;
};

//make ajax calls
var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: 'false',
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
