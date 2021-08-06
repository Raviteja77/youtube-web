

gapi.load("client", loadClient);
  
function loadClient() {
    gapi.client.setApiKey("AIzaSyAB92A3Iq6h1xlwsE9m_RiPBesMWQExEMI");
    return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
        .then(function() { console.log("GAPI client loaded for API"); },
                function(err) { console.error("Error loading GAPI client for API", err); });
}


function createElements() {
  let navbar = document.createElement("div");
  navbar.className="navBar";
  let icon = document.createElement("img");
  icon.setAttribute("id", "youtubeIcon")
  icon.src = "https://maxcdn.icons8.com/Share/icon/Media_Controls/youtube_play1600.png";
  navbar.appendChild(icon);
  let title = document.createElement("h2");
  title.innerHTML = "Youtube-Web";
  title.setAttribute("id", "title");
  navbar.appendChild(title);
  let inputField = document.createElement("INPUT");
  inputField.placeholder = "search keyword";
  inputField.setAttribute("id","keyword-input");
  navbar.appendChild(inputField);
  let btn = document.createElement("BUTTON");
  btn.setAttribute("id", "searchBtn");
  btn.innerHTML = "<i class='fa fa-search'></i>";
  navbar.appendChild(btn);
  document.body.appendChild(navbar);
  let videosDisplay = document.createElement("div");
  videosDisplay.setAttribute("id", "videoListContainer");
  document.body.appendChild(videosDisplay);
}

createElements();


const keywordInput = document.getElementById('keyword-input');
const videoList = document.getElementById('videoListContainer');
const searchbtn = document.getElementById('searchBtn');
var pageToken = '';
  
  
function paginate(e, obj) {
    e.preventDefault();
    pageToken = obj.getAttribute('data-id');
    execute();
}

searchbtn.addEventListener('click', e => {
  e.preventDefault();
  execute();
})
  

function execute() {
    const searchString = keywordInput.value;
    if(searchString.length === 0) {
      videoList.innerHTML = `<h1 id="errorMsg">Oops..!!! No results found</h1>`;
      return;
    }
    var arr_search = {
        "part": 'snippet',
        "type": 'video',
        "maxResults": 15,
        "q": searchString
    };
  
    if (pageToken != '') {
        arr_search.pageToken = pageToken;
    }
  
    return gapi.client.youtube.search.list(arr_search)
    .then(function(response) {
        
        const listItems = response.result.items;
        console.log(listItems);
        if (listItems) {
            let output = '<h2>Related Videos</h2><ul>';
            listItems.forEach(item => {
                const videoId = item.id.videoId;
                const videoTitle = item.snippet.title;
                const channelTitle = item.snippet.channelTitle;
                const description = item.snippet.description;
                const publishedDate = item.snippet.publishedAt;
                output += `
                <div class="videosarrange">
                    <div id = "videosArrangement">
                        <iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

                    </div>
                
                    <div>
                        <p id="videotitle">${videoTitle}</p>
                        <span>${publishedDate.substring(0, publishedDate.indexOf('T'))}</span>
                        <div id="channeltitle">${channelTitle}</div>
                        <div id="description">${description}</div>
                    </div> 
                </div>  
                `;
            });
            output += '</ul>';
            if (response.result.prevPageToken) {
                output += `<br><a class="paginate" href="#" data-id="${response.result.prevPageToken}" onclick="paginate(event, this)">Prev</a>`;
            }
  
            if (response.result.nextPageToken) {
                output += `<a href="#" class="paginate" data-id="${response.result.nextPageToken}" onclick="paginate(event, this)">Next</a>`;
            }
  
         
            videoList.innerHTML = output;
        }
    },
    function(err) { console.error("Execute error", err); });
}