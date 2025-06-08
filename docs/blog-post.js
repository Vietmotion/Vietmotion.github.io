// blog-post.js
const sheetID = "1UUAs7DpXismQv3ZCbtGnDwGjv5bJL2GyPhZwD25Pavk";
const sheetName = "Sheet1";
const url = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?tqx=out:json&sheet=${sheetName}`;

const queryParams = new URLSearchParams(window.location.search);
const postID = queryParams.get("id");

fetch(url)
  .then(res => res.text())
  .then(data => {
    const json = JSON.parse(data.substr(47).slice(0, -2));
    const rows = json.table.rows.map(r => r.c.map(c => (c ? c.v : "")));

    const headers = ["Title", "Summary", "Tag", "ImageURL", "PostID", "ContentURL"];
    const posts = rows
      .map(r => Object.fromEntries(headers.map((h, i) => [h, r[i]])))
      .filter(p => p.PostID && p.Title && p.Title.toLowerCase() !== "title");

    const post = posts.find(p => p.PostID === postID);
    if (post) {
      fetch(post.ContentURL)
        .then(res => res.text())
        .then(html => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, "text/html");
          const bodyContent = doc.body.innerHTML;
          renderPost({ ...post, Content: bodyContent });
        });
    } else {
      document.getElementById("post-content").innerHTML = "<p>❌ Post not found.</p>";
    }
  })
  .catch(err => {
    console.error("⚠ Error loading post:", err);
    document.getElementById("post-content").innerHTML = "<p>⚠ Error loading content.</p>";
  });

function renderPost(post) {
  const container = document.getElementById("post-content");
  container.innerHTML = `
    <h2>${post.Title}</h2>
    <p style="font-style: italic; color: #777;">Category: ${post.Tag}</p>
    <img src="${post.ImageURL}" alt="${post.Title}" style="width:100%;max-height:400px;object-fit:cover;margin:20px 0;" />
    <div>${post.Content}</div>
  `;
}
