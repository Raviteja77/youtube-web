

gapi.load("client", loadClient);
  
function loadClient() {
    gapi.client.setApiKey("AIzaSyAB92A3Iq6h1xlwsE9m_RiPBesMWQExEMI");
    return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
        .then(function() { console.log("GAPI client loaded for API"); },
                function(err) { console.error("Error loading GAPI client for API", err); });
}


const keywordInput = document.getElementById('navBar__keyword-input');
const videoList = document.getElementById('videoListContainer');
const searchbtn = document.getElementById('navBar__searchBtn');
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
  
function getTimeElapsedSinceUpload(date1) {
    const date2 = Date.now();
    var daysElapsed = (date2 - date1) / (1000 * 60 * 60 * 24 * 31 * 12);
    daysElapsed = parseInt(daysElapsed);
    if (daysElapsed <= 0) {
      daysElapsed = (date2 - date1) / (1000 * 60 * 60 * 24 * 31);
      daysElapsed = parseInt(daysElapsed);
      if (daysElapsed <= 0) {
        daysElapsed = (date2 - date1) / (1000 * 60 * 60 * 24);
        daysElapsed = parseInt(daysElapsed);
        if (daysElapsed <= 0) {
          daysElapsed = (date2 - date1) / (1000 * 60 * 60);
          daysElapsed = parseInt(daysElapsed);
          daysElapsed += " hours ago";
        } else daysElapsed += " days ago";
      } else {
        daysElapsed += " months ago";
      }
    } else {
      daysElapsed += " years ago";
    }
    return daysElapsed;
}

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
        if (listItems) {
            let output = '<h2>Related Videos</h2><ul>';
            
            listItems.forEach(item => {
                const videoId = item.id.videoId;
                const videoTitle = item.snippet.title;
                const channelTitle = item.snippet.channelTitle;
                const description = item.snippet.description;
                const timeElapsed = getTimeElapsedSinceUpload(new Date(item.snippet.publishedAt));
                output += `
                <div class="videoListContainer__videosarrange">
                    <div>
                        <iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
                    </div>
                
                    <div>
                        <p id="video-title">${videoTitle}</p>
                        <span>${timeElapsed}</span>
                        <div id="channel-title">${channelTitle}</div>
                        <div id="video-description">${description}</div>
                    </div> 
                </div>  
                `;
            });
            output += '</ul>';
            if (response.result.prevPageToken) {
                output += `<div class="pagination"><a class="paginate" href="#" data-id="${response.result.prevPageToken}" onclick="paginate(event, this)">Prev</a></div>`;
            }
  
            if (response.result.nextPageToken) {
                output += `<div class="pagination"><a href="#" class="paginate" data-id="${response.result.nextPageToken}" onclick="paginate(event, this)">Next</a></div>`;
            }
  
         
            videoList.innerHTML = output;
        }
    },
    function(err) { console.error("Execute error", err); });
}
