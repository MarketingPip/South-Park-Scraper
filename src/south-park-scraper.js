
let module = {}
module.exports = {

};

 // JSON Data to Fetch Episodes Info From (No Streams Included)
 async function fetchData(){

  try {
    let result = await fetch( "https://raw.githubusercontent.com/wargio/plugin.video.southpark_unofficial/addon-data/addon-data-en.json" )
   return result.json()
  } catch( err ) {
    return {error: err.message };
  }
  
}

  
  


// Fetch a South Park Episode
async function fetch_Episode(episode, season_number) {
  // 
if (!episode){
  return {south_park_error: "No episode number provided"}
}
  
  if (!season_number){
  return {south_park_error: "No season number provided"}
}
 
  
  
   
 let data = await fetchData()
 if(data.error){
     return {south_park_error: data.error}
    
 }
 
  
  let foundData = []
  let seasons = data.seasons[season_number]
  for (const episodes in seasons){
    if (episode === seasons[episodes].episode){
 
     let episodelinks = seasons[episodes].mediagen
     
     let DecodedLinks = [] 
     
     let FinalStreamURLS = []
     for (const link in episodelinks){
   
      let fetchlink = atob(episodelinks[link]).replace('http://', 'https://'); 
   
       
       // Look for the stream / m3u urls..
     const StreamURLs =  await fetch(fetchlink)
       
    
     
      let StreamData = await StreamURLs.json();
     
     for (const i in StreamData.package.video.item){
       /// stream was removed or banned in area etc..
       if (StreamData.package.video.item[i].code === "not_found"){
        foundData.push({season: seasons[episodes].season, episode: seasons[episodes].episode, title: seasons[episodes].title, description: seasons[episodes].details, season_cover_image: `https://raw.githubusercontent.com/wargio/plugin.video.southpark_unofficial/master/imgs/${seasons[episodes].season}.jpg`,  preview_image: seasons[episodes].image}, {error: "Not Found or Removed"})
         return foundData
       }
       
       // valid stream links
       if (StreamData.package.video.item[i]['rendition']){
         
          if (StreamData.package.video.item[i]['rendition'].src){
         
            FinalStreamURLS.push({url: StreamData.package.video.item[i]['rendition'].src})
          } else{
       for ( const x in StreamData.package.video.item[i]['rendition']){
        
         FinalStreamURLS.push({url: StreamData.package.video.item[i]['rendition'][x].src})
       }
      }
            
       } 
     }


     }
      
        foundData.push({season: seasons[episodes].season, episode: seasons[episodes].episode, title: seasons[episodes].title, description: seasons[episodes].details,  season_cover_image: `https://raw.githubusercontent.com/wargio/plugin.video.southpark_unofficial/master/imgs/${seasons[episodes].season}.jpg`, preview_image: seasons[episodes].image})
      
      foundData.push({stream_urls: FinalStreamURLS})
           // /console.log(foundData)
    }
  }
  return foundData;
}

async function southpark_Scraper(episode, season_number)
{
  
  try {
    let result = await fetch_Episode(episode, season_number);
   return result
  } catch( err ) {
    console.error( err.message );
  }
  
  
}



async function southpark_Core(arg1, arg2, arg3)
{

  if (arg1.toLowerCase() === "episode"){
    return await southpark_Scraper(arg2, arg3)
  }
  
    if (arg1.toLowerCase() === "random"){
    return await fetchRandom()
  }
  
    if (arg1.toLowerCase() === "season"){
      return await fetchSeason(arg2)
  }
  
}




// Fetch all episodes for season //

async function fetchSeason(season_number){
  
 
 let data = await fetchData()
 if(data.error){
     return {south_park_error: data.error}
    
 }
 
 
  if (data.seasons[season_number] == undefined){
    throw "Error: South Park Season Not Found"
  }
  
  
  let season_eps = []
  
  for (const episode in data.seasons[season_number]){
    for (const x in data.seasons){
      
      let results = await southpark_Scraper(data.seasons[season_number][x].episode, season_number)
      
      if (results.south_park_error){
       return {south_park_error: results.south_park_error}
      } else{
        season_eps.push(results)
      }
    
      if (parseInt(x) === data.seasons[season_number].length -1){
     
         return season_eps
      }
      
    
    }
     
  }
   
}


// Fetch random episode
async function fetchRandom(){
  

   
 let data = await fetchData()
 if(data.error){
     return {south_park_error: data.error}
    
 }
 
  
  
  
  function get_random (list) {
  return list[Math.floor((Math.random()*list.length))];
}


 let season = get_random(data.seasons)
 
  let random = get_random(season)
  //
 // console.log(random.episode)
//
 let random_ep = await southpark_Scraper(random.episode, random.season)
  
  return random_ep
  
  
}




 southpark_Core("random", "1", "1").then(function(search_results) {
  console.log(search_results)
 });  //////////////////////////

// Export it to make it available outside
module.exports.southpark_Core = southpark_Core;
