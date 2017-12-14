//function to render the elements needed for this page.
const createHomeWindow = () => {
  
  ReactDOM.render(
    <div/>, document.querySelector("#header")
  );

  ReactDOM.render(
    <div/>, document.querySelector("#form")
  );

  ReactDOM.render(
    <HomeBody />, document.querySelector("#content")
  );

  loadAllPosts();
};

//this should return all posts in the database within a certain date, I don't know why it doesn't
const HomeBody = (props) => {
  const homeNodes = props.posts.map(function(post) {
    return (
    <div key={post._id} className="post">
        <pre>
          <h1>{post.author}</h1>
          <p>{post.contents}</p>
        </pre>
      </div>
    );
  });
  
  return (
    <div classNames="homeBody">
      {homeNodes}
    </div>
  );

}

//get the data from the server.
const loadAllPosts = () => {
  sendAjax("GET", "/home", null, (data) => {
    ReactDOM.render(
    <HomeBody posts={data.posts} />, document.querySelector("#content")
    );
  });
};