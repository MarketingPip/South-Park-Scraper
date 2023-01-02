/**!
 * @license South-Park-Scraper.js - A JavaScript library for fetching free South Park stream URLs 
 * LICENSED UNDER MIT LICENSE
 * MORE INFO CAN BE FOUND AT https://github.com/MarketingPipeline/South-Park-Scraper.js
 */


/* NOTES TO DEVS - or future self if nobody contributes :C
* STOP MULTIPLE FETCH CALLS - STORE JSON LOCALLY & Parse.... this thing is making like 20 fetch calls (when calling links for full seasons.)
*/

//// SOUTH PARK SCRAPER 
export function southpark_scraper(arg1, arg2, arg3, arg4)
{
  
  // don't worry it's being awaited... 
  return callSouthParkScraper(arg2)
  
  
  

//// CORE FUNCTIONS   
async function callSouthParkScraper(arg2){ 

   if (!arg1){
   return {south_park_scraper_error: "Language code was not provided"}
  }else{
    arg1 = arg1.toLowerCase()
    
    let supportLangs = ["se", "en", "lat", "it", "eu", "es", "de", "br"]
    let langSupported = "false";
    for (const lang in supportLangs){
        if (arg1 == supportLangs[lang]){
          langSupported = "true";
        }
    }
    
   if (langSupported != "true"){
     return {south_park_scraper_error: `${arg1} language code is not supported`}
   }
    
    
  }
  
  if (!arg2){
   return {south_park_scraper_error: "Type was not provided, must be episode, season or random"}
  }
  
  arg2 = arg2.toLowerCase() 
  
    if (arg2 === "episode"){
    console.log(`Attempting to fetching episode ${arg3}, season ${arg3}`)
    return await southpark_scraper_core(arg3, arg4)
  }
  
    if (arg2 === "random"){
         // GIVE A NOTICE TO USER - this currently takes awhile 
    console.log(`Attempting to fetching random episode`)
    return await fetchRandom()
  }
  
    if (arg2 === "season"){
      // GIVE A NOTICE TO USER - this currently takes awhile 
      // ie - someone can improve this just by storing value retrived for season.... 
      console.log(`Attempting to fetching episodes for season ${arg3}`)
      console.log(arg3)

      return await fetchSeason(arg3)
  }

  
// Function to - Fetch a South Park Episode
async function fetch_Episode(episode, season_number) {
  // 
if (!episode){
   throw {south_park_scraper_error: "No episode number provided"}
}
  
  if (!season_number){
   throw {south_park_scraper_error: "No season number provided"}
} else{
  console.log(season_number)
  season_number = new String(Number(season_number) - 1).toString()
}
 
  

 let data = await fetchData()
 if(data.error){
      throw {south_park_scraper_error: data.error}
    
 }
 
  
  let foundData = []
  console.log(season_number)
  let seasons = data.seasons[season_number]
   if(season_number > data.seasons.length ) {
throw {south_park_scraper_error: `No season found for season ${season_number}`}
      }
   
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
   if (foundData.length === 0){
    // nothing was found :( 
     throw {south_park_scraper_error: "No Results Found"}
  } else{
   // whooo-hoo! taco-flavaaa kissas 
    return foundData
  }
}

// End of Function to - Fetch a South Park Episode




/// Function to find episode by (episode & season number)
async function southpark_scraper_core(episode, season_number)
{
  
  try {
    let result = await fetch_Episode(episode, season_number);
   return result
  } catch( err ) {
    return err;
  }
  
  
}
  
  

 // Function to fetch JSON Data for Fetch Episodes Info From (No Streams Included)
 async function fetchData(){

  try {
    let result = await fetch( "https://raw.githubusercontent.com/wargio/plugin.video.southpark_unofficial/addon-data/addon-data-en.json" )
   return result.json()
  } catch( err ) {
    throw {south_park_scraper_error: err.message };
  }
  
}

 /// End of Function to fetch JSON Data for Fetch Episodes ///
  
  


// Fetch all episodes for season #

async function fetchSeason(season_number){
  
 
 let data = await fetchData()
 if(data.error){
     return {south_park_error: data.error}
    
 }
 console.log(season_number)
 
  if (data.seasons[season_number] == undefined){
  throw {south_park_scraper_error: "South Park Season Not Found"}
  }
  
  
  let season_eps = []
  
  for (const episode in data.seasons[season_number]){
    for (const x in data.seasons){
      
      let results = await southpark_scraper_core(data.seasons[season_number][x].episode, season_number)
      
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
 
  
// END OF - Fetch all episodes for season # ///   
  
  



/// Fetch random episode ///
async function fetchRandom(){
  

   
 let data = await fetchData()
 if(data.error){
      throw {south_park_scraper_error: data.error}
    
 }
 
  
  
  
  function get_random (list) {
  return list[Math.floor((Math.random()*list.length))];
}


 let season = get_random(data.seasons)
 
  let random = get_random(season)
  //
 // console.log(random.episode)
//
 let random_ep = await southpark_scraper_core(random.episode, random.season)
  
  return random_ep
  
  
}

  
/// End of fetch all random episode ///  
  
  
  
}
/// END OF CORE FUNCTIONS  
  
  
}
//// END OF SOUTH PARK SCRAPER /// 

async function Fetch_Season_1_Episode_1() {
  try {
     let episode_details = southpark_scraper("en", "episode", "2", "2")
     console.log(await episode_details)
  } catch (err) {
  //  console.error(err);
  }
}
Fetch_Season_1_Episode_1()
