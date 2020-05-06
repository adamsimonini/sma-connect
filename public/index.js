const root = document.getElementById("root");

fetch("/api_auth")
  .then((response) => response.json())
  .then((data) => (root.innerText = JSON.stringify(data)));
