"use strict";

// Fetch a South Park Episode
async function fetch_Episode(episode, season_number) {
  // 

  
  const rsp = await fetch( "https://raw.githubusercontent.com/wargio/plugin.video.southpark_unofficial/addon-data/addon-data-en.json" ),
        data = await rsp.json(); 
  
  let foundData = []
  let seasons = data.seasons[season_number]
  for (const episodes in seasons){
    if (episode === seasons[episodes].episode){
     // console.log(`Found episode for season: ${seasons[episodes].season}, episode: ${episode} `)
     let episodelinks = seasons[episodes].mediagen
     
     let DecodedLinks = [] 
     
     let FinalStreamURLS = []
     for (const link in episodelinks){
   //   console.log(atob(episodelinks[link]))
        
      let fetchlink = atob(episodelinks[link]).replace('http://', 'https://'); 
     // console.log(fetchlink)
     const StreamURLs =  await fetch(fetchlink)
       
    
     
      let StreamData = await StreamURLs.json();
     
     for (const i in StreamData.package.video.item){
       if (StreamData.package.video.item[i].code === "not_found"){
        foundData.push({season: seasons[episodes].season, episode: seasons[episodes].episode, title: seasons[episodes].title, description: seasons[episodes].details, preview_image: seasons[episodes].image}, {error: "Not Found or Removed"})
         return foundData
       }
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
      
        foundData.push({season: seasons[episodes].season, episode: seasons[episodes].episode, title: seasons[episodes].title, description: seasons[episodes].details, preview_image: seasons[episodes].image})
      
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

// Fetch all episodes for season 

async function fetchSeason(season_number){
  
  const rsp = await fetch( "https://raw.githubusercontent.com/wargio/plugin.video.southpark_unofficial/addon-data/addon-data-en.json" ),
        data = await rsp.json(); 
  
  let season_eps = []
  
  for (const episode in data.seasons[season_number]){
    for (const x in data.seasons){
     
    //  console.log( data.seasons[season_number][x].episode)
      //console.log(data.seasons)
   season_eps.push(await southpark_Scraper(data.seasons[season_number][x].episode, season_number))
      console.log(x)
      if (parseInt(x) === data.seasons[season_number].length -1){
       // console.log(season_eps)
         return season_eps
      }
      //console.log(season_eps)
    
    }
     
  }
   
}


// Fetch random episode
async function fetchRandom(){
  
const rsp = await fetch( "https://raw.githubusercontent.com/wargio/plugin.video.southpark_unofficial/addon-data/addon-data-en.json" ),
        data = await rsp.json(); 
  
  
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



fetchSeason(1).then(function(search_results) {
  console.log(search_results)
 });  ////////////


fetchRandom().then(function(search_results) {
  console.log(search_results)
 });  ////////////

southpark_Scraper("1",1).then(function(search_results) {
  console.log(search_results)
 });  ///////////////////


southpark_Scraper("1",24).then(function(search_results) {
  console.log(search_results)
 });  ///////////////////
