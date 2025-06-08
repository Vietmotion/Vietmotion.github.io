const sheetID = "1UUAs7DpXismQv3ZCbtGnDwGjv5bJL2GyPhZwD25Pavk";
const sheetName = "Sheet1";
const url = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?tqx=out:json&sheet=${sheetName}`;

fetch(url)
  .then(res => res.text())
  .then(data => {
    const json = JSON.parse(data.substr(47).slice(0, -2));
    const rows = json.table.rows.map(r => r.c.map(c => (c ? c.v : "")));

    // Set header names manually
    const headers = ["Title", "Summary", "Tag", "ImageURL", "PostID", "Content"];

    // Map and filter rows
    const posts = rows
      .map(r => Object.fromEntries(headers.map((h, i) => [h, r[i]])))
      .filter(p =>
        p.PostID &&
        p.Title &&
        p.Title.toLowerCase() !== "title"
      );

    console.log("✔ Posts fetched:", posts);
    renderBlog(posts);
  })
  .catch(err => {
    console.error("⚠ Failed to fetch blog data:", err);
  });

function renderBlog(posts) {
  const container = document.getElementById("blog-container");
  const tagSet = new Set();
  posts.forEach(p => tagSet.add(p.Tag));

  const tagFilter = document.getElementById("tag-filter");
  const tags = ["All", ...Array.from(tagSet)];
  tagFilter.innerHTML = ""; // clear previous

  tags.forEach(tag => {
    const btn = document.createElement("button");
    btn.textContent = tag;
    btn.onclick = () => {
      document.querySelectorAll("#tag-filter button").forEach(b => b.classList.remove("btn"));
      btn.classList.add("btn");
      displayPosts(tag === "All" ? posts : posts.filter(p => p.Tag === tag));
    };
    tagFilter.appendChild(btn);
  });

  // Auto-click first tag
  tagFilter.querySelector("button").click();
}

function displayPosts(filtered) {
  const container = document.getElementById("blog-container");
  container.innerHTML = "";
  filtered.forEach(post => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${post.ImageURL || 'img/placeholder.jpg'}" alt="${post.Title}" />
      <h3>${post.Title}</h3>
      <p>${post.Summary}</p>
      <a href="blog-post.html?id=${post.PostID}" class="btn">Read More</a>
    `;
    container.appendChild(card);
  });
}
