

let navbar = document.createElement("div");
navbar.className="navBar";

let icon = document.createElement("img");
icon.setAttribute("id", "navBar__youtubeIcon")
icon.src = "https://maxcdn.icons8.com/Share/icon/Media_Controls/youtube_play1600.png";
navbar.appendChild(icon);

let title = document.createElement("h2");
title.innerHTML = "Youtube-Web";
title.setAttribute("id", "navBar__title");
navbar.appendChild(title);

let inputField = document.createElement("INPUT");
inputField.placeholder = "search keyword";
inputField.setAttribute("id","navBar__keyword-input");
navbar.appendChild(inputField);

let btn = document.createElement("BUTTON");
btn.setAttribute("id", "navBar__searchBtn");
btn.innerHTML = "<i class='fa fa-search'></i>";
navbar.appendChild(btn);

document.body.appendChild(navbar);

let videosDisplay = document.createElement("div");
videosDisplay.setAttribute("id", "videoListContainer");
document.body.appendChild(videosDisplay);
