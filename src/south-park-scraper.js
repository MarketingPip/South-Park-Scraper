/**!
 * @license South-Park-Scraper.js - A JavaScript library for fetching free South Park stream URLs 
 * LICENSED UNDER MIT LICENSE
 * MORE INFO CAN BE FOUND AT https://github.com/MarketingPipeline/South-Park-Scraper.js
 */



//// SOUTH PARK SCRAPER 
let cache = null;
// Constants
const SUPPORTED_LANGUAGES = ["se", "en", "lat", "it", "eu", "es", "de", "br"];
const EPISODE_TYPE = "episode";
const RANDOM_TYPE = "random";
const SEASON_TYPE = "season";  

//// CORE FUNCTIONS   
// Main South Park Scraper function
async function southParkScraper(language, type, arg3, arg4) {
    try {
        if (!language || !isLanguageSupported(language.toLowerCase())) {
            handleError("Invalid or unsupported language code");
        }

        if (!type) {
            handleError("Type was not provided; must be 'episode', 'season', or 'random'");
        }

        type = type.toLowerCase();

        switch (type) {
            case EPISODE_TYPE:
                console.log(`Attempting to fetch episode ${arg3}, season ${arg4}`);
                return await fetchEpisode(arg3, arg4);
            case RANDOM_TYPE:
                console.log("Attempting to fetch a random episode");
                return await fetchRandomEpisode();
            case SEASON_TYPE:
                console.log(`Attempting to fetch episodes for season ${arg3}`);
                return await fetchSeasonEpisodes(arg3);
            default:
                handleError("Invalid type; must be 'episode', 'season', or 'random'");
        }
    } catch (err) {
        return { southParkScraperError: err.message };
    }
}
 

// Function to check if a language code is supported
function isLanguageSupported(lang) {
    return SUPPORTED_LANGUAGES.includes(lang);
}

// Function to - Fetch a South Park Episode
async function fetchEpisode(episode, season_number) {
  if (!episode) {
    throw { south_park_scraper_error: "No episode number provided" };
  }

  if (!season_number) {
    throw { south_park_scraper_error: "No season number provided" };
  } else {
    season_number = String(Number(season_number) - 1).toString();
  }

  try {
    const data = await fetchData();

    if (data.error) {
      throw { south_park_scraper_error: data.error };
    }

    if (season_number >= data.seasons.length) {
      throw {
        south_park_scraper_error: `No season found for season ${season_number}`,
      };
    }

    const foundData = [];
    const seasons = data.seasons[season_number];

    const episodePromises = [];

    for (const episodes in seasons) {
      console.log(seasons[epsiodes])
      if (episode === seasons[episodes].episode) {
        const episodelinks = seasons[episodes].mediagen;
        const finalStreamURLs = [];

        episodelinks.forEach((link) => {
          const fetchlink = atob(link).replace("http://", "https://");
          episodePromises.push(fetch(fetchlink).then((res) => res.json()));
        });

        const streamDatas = await Promise.all(episodePromises);

        streamDatas.forEach((streamData) => {
          for (const i in streamData.package.video.item) {
            if (streamData.package.video.item[i].code === "not_found") {
              foundData.push({
                season: seasons[episodes].season,
                episode: seasons[episodes].episode,
                title: seasons[episodes].title,
                description: seasons[episodes].details,
                season_cover_image: `https://raw.githubusercontent.com/wargio/plugin.video.southpark_unofficial/master/imgs/${seasons[episodes].season}.jpg`,
                preview_image: seasons[episodes].image,
              },
              { error: "Not Found or Removed" });
              return foundData;
            }

            if (streamData.package.video.item[i]["rendition"]) {
              if (streamData.package.video.item[i]["rendition"].src) {
                finalStreamURLs.push({
                  url: streamData.package.video.item[i]["rendition"].src,
                });
              } else {
                for (const x in streamData.package.video.item[i]["rendition"]) {
                  finalStreamURLs.push({
                    url: streamData.package.video.item[i]["rendition"][x].src,
                  });
                }
              }
            }
          }
        });

        foundData.push({
          season: seasons[episodes].season,
          episode: seasons[episodes].episode,
          title: seasons[episodes].title,
          description: seasons[episodes].details,
          season_cover_image: `https://raw.githubusercontent.com/wargio/plugin.video.southpark_unofficial/master/imgs/${seasons[episodes].season}.jpg`,
          preview_image: seasons[episodes].image,
        });

        foundData.push({ stream_urls: finalStreamURLs });
      }
    }

    if (foundData.length === 0) {
      throw { south_park_scraper_error: "No Results Found" };
    } else {
      return foundData;
    }
  } catch (error) {
    // Handle other errors, log, or rethrow if necessary
    throw error;
  }
}


// End of Function to - Fetch a South Park Episode




  
  

 // Function to fetch JSON Data for Fetch Episodes Info From (No Streams Included)


async function fetchData() {
  // Check if data is already in the cache
  if (cache) {
    return cache;
  }

  try {
    let result = await fetch("https://raw.githubusercontent.com/wargio/plugin.video.southpark_unofficial/addon-data/addon-data-en.json");
    let data = await result.json();

    // Cache the data for future use
    cache = data;

    return data;
  } catch (err) {
    throw { south_park_scraper_error: err.message };
  }
}


 /// End of Function to fetch JSON Data for Fetch Episodes ///
  
  


// Fetch all episodes for season #

async function fetchSeasonEpisodes(seasonNumber){
  try {
        const data = await fetchData();
        if (data.error) {
            return { southParkError: data.error };
        }

        // Convert seasonNumber to a number and check if it's valid
        seasonNumber = Number(seasonNumber);
        if (isNaN(seasonNumber) || seasonNumber < 1 || seasonNumber > data.seasons.length) {
             throw new Error("South Park Season Not Found")
        }

        // Adjust seasonNumber for array indexing
        const adjustedSeasonNumber = seasonNumber - 1;

        const seasonEps = [];
        for (const episode of data.seasons[adjustedSeasonNumber]) {
            const results = await fetchEpisode(episode.episode, seasonNumber);
            if (results.southParkError) {
                return { southParkError: results.southParkError };
            } else {
                seasonEps.push(results);
            }
        }

        return seasonEps;
    } catch (err) {
        return { southParkError: err.message };
    }
   
}
 
  
// END OF - Fetch all episodes for season # ///   
  
  



/// Fetch random episode ///
async function fetchRandomEpisode(){
  

   
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
  
  


//// END OF SOUTH PARK SCRAPER /// 

async function Fetch_Season_1_Episode_1() {
  try {
     let episode_details = southParkScraper("en", "season", "2", "1") ////
     console.log(await episode_details)
  } catch (err) {
    console.error(err.message);//
  }
}
//Fetch_Season_1_Episode_1() 
