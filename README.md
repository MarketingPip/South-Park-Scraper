# South-Park-Scraper.js

A pure JavaScript library for scraping free streams / free episodes of South Park - works in the browser!

## Example and usage 

<details>
<summary>Fetch all episodes in a <b>season</b></summary>


<br>

> OPTIONS: (Language [REQUIRED],  Type [REQUIRED],  Season Number [REQUIRED])


```js
import {southpark_scraper} from 'https://cdn.jsdelivr.net/gh/MarketingPipeline/IPTV-Parser.js/dist/iptv-parser.min.js';

async function Fetch_Season_1_Episodes() {
  try {
     let episode_details = southpark_scraper("en", "season", "1")
     console.log(await episode_details)
  } catch (err) {
  //  console.error(err);
  }
}
Fetch_Season_1_Episodes()
```




</details>



<details>
<summary>Fetch episode by <b>episode</b> & <b>season</b> number</summary>

> OPTIONS: (Language [REQUIRED], Type [REQUIRED], Episode Number [REQUIRED], Season Number [REQUIRED])

```js
import {southpark_scraper} from 'https://cdn.jsdelivr.net/gh/MarketingPipeline/IPTV-Parser.js/dist/iptv-parser.min.js';
async function Fetch_Season_1_Episode_1() {
  try {
     let episode_details = southpark_scraper("en", "episode", "1", "1")
     console.log(await episode_details)
  } catch (err) {
  //  console.error(err);
  }
}
Fetch_Season_1_Episode_1()
```
</details>





<details>
<summary>Fetch <b>random</b> episode</summary>

> OPTIONS: (Language [REQUIRED], Type [REQUIRED])

```js
import {southpark_scraper} from 'https://cdn.jsdelivr.net/gh/MarketingPipeline/IPTV-Parser.js/dist/iptv-parser.min.js';
async function Fetch_Random_Episode() {
  try {
     let episode_details = southpark_scraper("en", "random")
     console.log(await episode_details)
  } catch (err) {
  //  console.error(err);
  }
}
Fetch_Random_Episode()
```
</details>

## Options


<table>
<tr>
<th>Parameters</th>
<th>Meaning</th>
<th>Default</th>
<th>Required</th>
</tr>
<tr>
<td>query</td>
 <td>Language code for streams  - options:<code>en, </code>.</td>
<td><code>en</code></td>
<td>Yes</td>
</tr>


<tr>
<td>type</td>
              <td>Type of search you want to make - options:<code>Episode, Random, Season</code>.</td>
<td><code>undefined</code></td>
<td>Yes</td>
</tr>

<tr>
<td>episode</td>
              <td>Episode number to use</td>
<td><code>undefined</code></td>
<td>Yes</td>
</tr>


<tr>
<td>season</td>
              <td>Season number to find</td>
<td><code>undefined</code></td>
<td>Yes</td>
</tr>


</table>


## Supported Countries 

The supported countries are the one that can view videos from one of the following websites below. 
- https://southpark.cc.com
- https://southparkstudios.co.uk
- https://southparkstudios.nu
- https://www.southpark.de
- https://www.southpark.lat
- https://www.southparkstudios.com.br
  
## Disclaimer

Usage of this library may be illegal depending on your country laws. Please check your local streaming laws / laws before using it. The author of this library assumes no responsibility for your usage of this.   
 
## Contribution

If you find a bug or want to contribute to the code or documentation, you can help by submitting an [issue](https://github.com/MarketingPip/South-Park-Scraper.js/issues) or a [pull request](https://github.com/MarketingPip/South-Park-Scraper.js/pulls).


## License 

[MIT](https://github.com/MarketingPipeline/TheMovieDB-API-Wrapper.js/blob/main/LICENSE)
