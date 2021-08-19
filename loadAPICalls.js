
const API_KEY = "AIzaSyAsy8O_6WUv8paJ-5hNHxs79UrUsKYnilo";
const keywordInput = document.getElementById('navBar__keyword-input');
const videoList = document.getElementById('videoListContainer');
const searchbtn = document.getElementById('navBar__searchBtn');
let pageToken = '';
  
  
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


async function execute() {
    const searchString = keywordInput.value;
    let output = '';
    
    try {
      let searchLink = '';
      if(pageToken != '') 
        searchLink = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&type=video&part=snippet&maxResults=15&q=${searchString}&pageToken=${pageToken}`;
      
      else
        searchLink = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&type=video&part=snippet&maxResults=15&q=${searchString}`
        const searchData = await fetch(searchLink);

      try {
        const data = await searchData.json();

        let listItems = data.items;
        // console.log(data);
        if (listItems) {
           output += '<h2>Related Videos</h2><ul>';
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
        }

        if (data.prevPageToken) {
          output += `<div class="pagination"><a class="paginate" href="#" data-id="${data.prevPageToken}" onclick="paginate(event, this)">Prev</a></div>`;
          // console.log("prev",data.prevPageToken);
        }

        if (data.nextPageToken) {
          output += `<div class="pagination"><a href="#" class="paginate" data-id="${data.nextPageToken}" onclick="paginate(event, this)">Next</a></div>`;
          data.prevPageToken = data.nextPageToken;
          // console.log("next",data.nextPageToken);
        }

        videoList.innerHTML = output;
      } catch(error) {
        console.log(error);
      }
      
    } catch(error) {
      console.log(error);
    }
  
}
