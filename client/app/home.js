const createHomeWindow = () => {
  
  ReactDOM.render(
    <div/>, document.querySelector("#header")
  );

  ReactDOM.render(
    <div/>, document.querySelector("#form")
  );

  ReactDOM.render(
    <HomeBody/>, document.querySelector("#content")
  );

  loadAllPosts();
};

const HomeBody = (props) => {
  const homeNodes = props.content.map(function(post) {
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
      {postNodes}
    </div>
  );

}
  
const loadAllPosts = () => {
  
  sendAjax("GET", "/home", null, (data) => {
    ReactDOM.render(
    <homeBody content={data.content} />, document.querySelector("#content")
    );
  });
};