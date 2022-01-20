# ATTENTION!
### Due to bad code writing, the whole project needs reworking.
### This project has reworked code on 'reworking' branch, check it out

## Table of contents
[Information](https://github.com/PeWuPL/shinden-api#info)<br>
[What is it?](https://github.com/PeWuPL/shinden-api#wii)<br>
[Usage example](https://github.com/PeWuPL/shinden-api#usage)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Example](https://github.com/PeWuPL/shinden-api#wii_examples)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Returned value](https://github.com/PeWuPL/shinden-api#wii_returns)<br>
[How to install](https://github.com/PeWuPL/shinden-api#installation)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Preparing installation](https://github.com/PeWuPL/shinden-api#installation_preparing)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Downloading and installing API](https://github.com/PeWuPL/shinden-api#installation_api)<br>
[Commands](https://github.com/PeWuPL/shinden-api#cmds)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Launching commands](https://github.com/PeWuPL/shinden-api#cmds_launching)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Arguments](https://github.com/PeWuPL/shinden-api#cmds_arguments)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Modes](https://github.com/PeWuPL/shinden-api#cmds_modes)<br>
[Available functions](https://github.com/PeWuPL/shinden-api#functions)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Include module](https://github.com/PeWuPL/shinden-api#functions_include)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Search](https://github.com/PeWuPL/shinden-api#functions_search)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Details](https://github.com/PeWuPL/shinden-api#functions_details)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Episodes](https://github.com/PeWuPL/shinden-api#functions_episodes)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Comments](https://github.com/PeWuPL/shinden-api#functions_comments)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Players](https://github.com/PeWuPL/shinden-api#functions_players)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Player link](https://github.com/PeWuPL/shinden-api#functions_link)<br>
# Before starting... <a name="info"></a>
I'm not perfect.<br>
This API was created in free time based on my knowledge. I know that some things can be done better, and I'll definitely work on them to be better.<br>
There are bugs, error etc. but I will try to remove them and make this even more usable.
# <a name="wii"></a>What is it?
It's an unofficial Shinden API for getting raw information from the page.<br>
# <a name="usage"></a>Usage example:
It allows to get values from http://shinden.pl and pipe it into variables.<br>
## <a name="wii_examples"></a>Example:
```js 
getAnimeList("Naruto",4).then((out)=>{console.log(out)})
```
## <a name="wii_returns"></a>Returns:
```js
[
  [
    'Rock Lee no Seishun Full-Power Ninden',
    'https://shinden.pl/series/13253-rock-lee-no-seishun-full-power-ninden'
  ],
  [
    'Beautiful World',
    'https://shinden.pl/series/49905-beautiful-world'
  ],
  [
    'Boruto Jump Festa 2016 Special',
    'https://shinden.pl/series/51838-boruto-jump-festa-2016-special'
  ],
  [ "Aesop's World", 'https://shinden.pl/series/7099-aesop-s-world' ],
  [ 'Star Dust', 'https://shinden.pl/series/15436-star-dust' ],
  [
    'Star Driver: Kagayaki no Takuto',
    'https://shinden.pl/series/10616-star-driver-kagayaki-no-takuto'
  ],
  [
    'Karasu Tengu Kabuto',
    'https://shinden.pl/series/3758-karasu-tengu-kabuto'
  ],
  [ 'Arte', 'https://shinden.pl/series/55327-arte' ],
  [ 'Auto Mommy', 'https://shinden.pl/series/9723-auto-mommy' ],
  [ 'Last Exile', 'https://shinden.pl/series/77-last-exile' ]
]
```
# <a name="installation"></a>How to install
## <a name="installation_preparing"></a>Preparing Node.js
You firstly need an Node.js installed on your system.<br>
You can download it [here](https://nodejs.org/en/ "Site to download Node.js").<br>
After downloading and installing, launch in cmd those commands:<br>
``npm install xmlhttprequest -g``<br>
``npm install puppeteer -g``<br>
(Those installs basic html page requesting, and more advanced headless browser for processing JavaScript on page)<br>
## <a name="installation_api"></a>Downloading and installing API
Download this repository, unzip it there.<br>
If everything has gone alright, then try launching it!<br>
``C:\someFolder>node run api.js -h``
You should see something like this:<br><br>
![image](https://user-images.githubusercontent.com/42903478/114323447-873dc680-9b25-11eb-8eb9-55f1de1bb30c.png)<br>
And done! Now you can run some nice web-crawling API's like this.
# Commands explanation<a name="cmds"></a>
This API supports commands just to ease life and quickly display some things.
## <a name="cmds_launching"></a>Launching commands
To launch commands go to folder with downloaded module and run
``node api.js [mode] (other_args)``
## <a name="cmds_arguments"></a>Arguments
This api uses argument types listed below:
Argument | Description | Example
-------- | ----------- | -------
Keyword | Just word | "Fairy Tail"
Page_nr | Number of page | 4
Title_url | Url to title's page | https://shinden.pl/series/246-bleach
Category | Category element of listed element | title,description,tags,related,rating,info,stats
Episode_nr | Number of title's episode | 69
Episode_url | Link to episode | https://shinden.pl/episode/246-bleach/view/6526
Username | Profile's username | BarryAllen
Password | Profile's password | verysafepass
Player_id | ID of episode player | 177013
API_key | Key for authorization page | TmljazpQcm9maWxlX25yLD8_PyxkYXRlLD8_Pyxzb21laGFzaD8

## <a name="cmds_modes"></a>Modes
This API has modes that can operate:<br>
Mode | Description | Arguments | Returns
---- | ----------- | --------- | --------
-h | Displays help | - | Help
-s | Searches for ``keyword``. Lists first page if ``page`` not specified | Keyword,Page_nr | Array with 10 arrays. These arrays has __title_name__ and __url__.
-i | Lists information about title. Lists only ``category`` if specified | Title_url,Category | Object with categories.
-c | Lists comments | Title_url | Array with 10 objects (10 latest comments)
-e | Lists episodes of ```Title_url```. Username and password are optional - they are needed when page does not list episodes for signed in people | Title_url, Episode_nr, <username> <password> | Array with x objects (lists all episodes)
-p | Lists player ID's | Episode_url | Array with x objects (lists all players)
~~-g~~ | ~~Lists Player URL~~ | ~~Player_id, API_key~~ | ~~String with link~~
  
# Available functions<a name="functions"></a>
**All functions mentioned are asynchronous, to proper handle them use .then(callback)**

## <a name="functions_include"></a>Include module into script:<br>
```js
var shinapi = require("shinden-api");
```

## <a name="functions_search"></a>Search
```js 
shinapi.getAnimeList(keyword,page)
```
Returns search results of "``keyword``" from ``page`` page.<br>
If page not specified, results first. <br>
This is an object with 10 arrays that has each title and url.<br>
Equivalent of ``api.js -s keyword page``.<br>

## <a name="functions_details"></a>Details
```js
shinapi.getDetails(title_url,category)
```
Returns details with objects such as:<br>
``title``,``description``,``tags``,``related``,``rating``,``info``,``stats``.<br>
Category is not needed, is only used to return more specific data.
Equivalent of ``api.js -d title_url category``.<br>

## <a name="functions_episodes"></a>Episodes
```js
shinapi.getEpisodes(episode_url,episode_nr,username,password)
```
Returns array with 10 arrays, each of one containing "title" and "url".<br>
``username`` and ``password`` are unnecessary, they are needed when all episode's information aren't captured.<br>
**They are not stored!**
Equivalent of ``api.js -e episode_url episode_nr username password``.

## <a name="functions_comments"></a>Comments
```js
shinapi.getComments(title_url)
```
Returns array with 10 objects, each containing ``user``,``nick``,``tag``,``date`` and ``comment`` properties.<br>
Equivalent of ``api.js -c title_url``.

## <a name="functions_players"></a>Players
```js
shinapi.getPlayerList(episode_url)
```
Returns an array of objects containing ``player``,``quality``,``voice_lang``,``sub_lang``,``added_date``,``player_id`` properties.<br>
Equivalent of ``api.js -p episode_url``.

## <a name="functions_link"></a>Player Link
```js
shinapi.getVideoLink(player_id,API_key)
```
**For that moment, this feature is disabled (need to decipher some numbers in the auth key).**<br>
Returns string containing link. ``API_key`` is needed to work.<br>
Equivalent of ``api.js -g player_id API_key``.
