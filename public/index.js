const root = document.getElementById("root");

fetch("/api")
  .then((response) => response.json())
  .then((data) => (root.innerText = JSON.stringify(data)));
