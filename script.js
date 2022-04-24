const postsContainer = document.getElementById("posts-container");
const filter = document.getElementById("filter");
const loader = document.querySelector(".loader");

let page = 1;
let limit = 5;
const dataFromBack = [];

let oldDataLength = dataFromBack.length;
let newDataLength;
let loaderIndicate = false;

async function getPosts() {
  oldDataLength = dataFromBack.length;

  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_limit=${limit}&_page=${page}`
  );

  const data = await res.json();
  ++page;
  console.log(page);

  for (key in data) {
    dataFromBack.push(data[key]);
  }

  newDataLength = dataFromBack.length;

  return data;
}

function renderItem({ title, id, body }) {
  return `
  <div class="post">
    <div class="number">${id}</div>
    <div class="post-info">
      <h2 class="post-title">${title} </h2>
      <p class="post-body">${body}</p>
    </div>
  </div>
`;
}

function renderItems(items) {
  let text = "";

  for (key in items) {
    text += renderItem(items[key]);
  }

  return text;
}

async function showPosts() {
  const posts = await getPosts();

  const filteredPosts = searchPosts(filter.value, posts);

  postsContainer.innerHTML += renderItems(filteredPosts);
}

function showLoading() {
  loaderIndicate = true;
  loader.classList.add("show");

  showPosts().then(() => {
    loader.classList.remove("show");
    loaderIndicate = false;
  });
}

function searchPosts(text, dataFromBack) {
  const term = text.toLowerCase();
  console.log(term);
  const filteredPosts = dataFromBack.filter(({ title, body, id }) => {
    return (
      title.toLowerCase().indexOf(term) >= 0 ||
      body.toLowerCase().indexOf(term) >= 0 ||
      String(id).toLowerCase().indexOf(term) >= 0
    );
  });

  return filteredPosts;
}

function renderFilteredItems(event) {
  const filteredPosts = searchPosts(event.target.value, dataFromBack);
  postsContainer.innerHTML = renderItems(filteredPosts);
}

showPosts();

window.addEventListener("scroll", () => {
  if (oldDataLength === newDataLength) {
    return;
  }

  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

  if (scrollTop + clientHeight >= scrollHeight - 5 && !loaderIndicate) {
    console.log("end");

    showLoading();
  }
});

filter.addEventListener("input", renderFilteredItems);
