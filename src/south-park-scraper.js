"use strict";

// Fetch a South Park Episode
async function fetch_Episode(episode, season_number) {
  // 
  

 let HTTP_ProxyURL = `https://gp-js-test.herokuapp.com/proxy`
  
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
      console.log(atob(episodelinks[link]))
        
      let fetchlink = atob(episodelinks[link]).replace('http', 'https'); 
       //
     const StreamURLs =  await fetch(fetchlink)
       
    
     
      let StreamData = await StreamURLs.json();
     
     for (const i in StreamData.package.video.item){
       if (StreamData.package.video.item[i].code === "not_found"){
          FinalStreamURLS.push({error: "Not Found or Removed"})
       }
       if (StreamData.package.video.item[i]['rendition'].src){
            FinalStreamURLS.push({url: StreamData.package.video.item[i]['rendition'].src})
       } else{
       for ( const x in StreamData.package.video.item[i]['rendition']){
        
         FinalStreamURLS.push({url: StreamData.package.video.item[i]['rendition'][x].src})
       }
      }
     }
       
      
       
      
       
       

     }
      
        foundData.push({season: seasons[episodes].season, episode: seasons[episodes].episode, title: seasons[episodes].title, description: seasons[episodes].details, preview_image: seasons[episodes].image})
      
      foundData.push({stream_urls: FinalStreamURLS})
            console.log(foundData)
    }
  }
  return foundData;
}

async function southpark_Scraper(episode, season_number)
{
  try {
    let result = await fetch_Episode(episode, season_number);
   
  } catch( err ) {
    console.error( err.message );
  }
}
southpark_Scraper('1', 22)  //
