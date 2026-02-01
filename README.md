<div align="center">
 <h1>X-Downloader-Scraper</h1>

  download media from X/twitter via graphql
  
   <a href="https://github.com/Keito-Klein/x-downloader-scraper"><img title="Repository" src="https://img.shields.io/badge/Downloader-green?style=for-the-badge&logo=X&logoColor=%23fceb28&color=017e40"></a>

   <a href="https://github.com/Keito-Klein"><img title="Author" src="https://img.shields.io/badge/AUTHOR-MiKako-yellow.svg?style=for-the-badge&logo=github"></a><br>
        <a href="https://github.com/Keito-Klein?tab=followers"><img title="Followers" src="https://img.shields.io/github/followers/Keito-Klein?color=blue&style=flat-square"></a>
        <a href="https://github.com/Keito-Klein/WiBot/stargazers/"><img title="Stars" src="https://img.shields.io/github/stars/Keito-Klein/x-downloader-scraper?style=flat-square"></a>
        <a href="https://github.com/Keito-Klein/WiBot/network/members"><img title="Forks" src="https://img.shields.io/github/forks/Keito-Klein/x-downloader-scraper?color=red&style=flat-square"></a>
          <a href="https://github.com/Keito-Klein/WiBot/watchers"><img title="Watching" src="https://img.shields.io/github/watchers/Keito-Klein/x-downloader-scraper?label=Watchers&color=blue&style=flat-square"></a>
</div>


## How to use?  <img src="https://github.com/TheDudeThatCode/TheDudeThatCode/blob/master/Assets/coin.gif" width="25px">
this code based on `./test/test.js`
```js
import XD from 'x-downloader-scraper';
// Async function to run the test
async function runTest() {
    const url = 'https://x.com/Eveveb_414/status/2017564730383327277?s=20'; // Example X post URL
    const config = {
        cookie: "", //set your cookie or leave it empty
        authorization: "", //set your authorization or leave it empty
        userAgent: "", //set your user agent or leave it empty
    };
    const proxy = null; // No proxy for this test
    const result = await XD(url, config, proxy);
    if (result.status === "error") {
        console.error("Error:", result.message);
        return;
    }
    console.log(JSON.stringify(result, null, 2));
}

// Run the test
runTest();
```

## Result   <img src="https://github.com/TheDudeThatCode/TheDudeThatCode/blob/master/Assets/Earth.gif" width="25px">
### example results with all data

```js
{
  status: String,
  data: {
    author: {
      name: String,
      screen_name: String,
      verified: Boolean,
      bio: String,
      location: String,
      member_since: String,
      profile_url: String,
      avatar_url: String,
      banner_url: String,
      can_dm: Boolean || String, // String must be "unknown"
      statistics: {
        followers: Number,
        following: Number,
        favourites: Number,
        listed_count: Number,
        media_count: Number
      }
    },
    statistics: {
      favorites: Number,
      bookmarks: Number,
      quote_count: Number,
      reply_count: Number,
      retweet_count: Number
    },
    result: {
      id: String,
      created_at: String,
      description: String,
      language: String,
      possibly_nsfw: Boolean,
      media_count: Number,
      media: [Array]
    }
  }
}
```

### Media result

```js
...existing code
media: [
        //Example for gif
        {
          type: "animated_gif",
          quality: String,
          thum: String,
          url: String,
          source: String
        },
        
        //Example for image
        {
          type: "photo",
          source: String,
          url: String
        },

        //example for Video
        {
          type: "video",
          thumb: String,
          source: String,
          variants: [
            {
              bitrate: Number || null, //null if content_type is x-mpegURL
              content_type: String,
              url: String
            },
          ]
        }
      ]
```

## Error    <img src="https://github.com/TheDudeThatCode/TheDudeThatCode/blob/master/Assets/powerup.gif" width="25px">
```js
{ 
    status: "error",
    message: String
}
```