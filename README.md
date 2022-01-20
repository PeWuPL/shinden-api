# ATTENTION!
### This branch is for reworking code from main branch

## Table of contents
[Information](#info)<br>
[What is it?](#wii)<br>
[Usage example](#usage)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Example](#wii_examples)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Returned value](#wii_returns)<br>
[How to install](#installation)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Preparing installation](#installation_preparing)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Downloading and installing API](#installation_api)<br>
[Commands](#cmds)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Launching commands](#cmds_launching)<br>
[Changelog](#changelog)<br>
# Before starting... <a name="info"></a>
I'm not perfect.<br>
This API was created and reworked in free time based on my knowledge. I know that some things can be done better, and I'll definitely work on them to be better.<br>
There are bugs, error etc. but I will try to remove them and make this even more usable.
# <a name="wii"></a>What is it?
It's an unofficial Shinden API for getting raw information from the page.  
Now it was remade to be more stable and useful
# <a name="usage"></a>Usage example:
It allows to get values from http://shinden.pl and pipe it into variables.<br>
## <a name="wii_examples"></a>Example:
```js 
search("Naruto",4).then((out)=>{console.log(out)})
```
## <a name="wii_returns"></a>Returns:
```js
...
TitleSearch {
    url:
     'https://shinden.pl/series/12126-naruto-honoo-no-chuunin-shiken-naruto-vs-konohamaru',
    title: 'Naruto: Honoo no Chuunin Shiken! Naruto vs. Konohamaru!!',
    tags: [ 'Akcja', 'Przygodowe', 'Sztuki walki' ],
    img: 'https://shinden.pl/res/images/100x100/192143.jpg',
    type: 'Movie',
    episodes: '1',
    rating:
     [ 'Ogólna: 7,46',
       'Fabuła: 7,45',
       'Grafika: 7,75',
       'Muzyka: 7,41',
       'Postacie: 8,05' ],
    status: 'Zakończone',
    topranking: '6,97' } 
...
```
# <a name="installation"></a>How to install
## <a name="installation_preparing"></a>Preparing Node.js
You firstly need an Node.js installed on your system.<br>
You can download it [here](https://nodejs.org/en/ "Site to download Node.js").<br>
After downloading and installing, launch in cmd those commands:<br>
``npm install request -g``<br>
``npm install cheerio -g``<br>
(Those installs basic https requesting and module for parsing HTML)<br>
## <a name="installation_api"></a>Downloading and installing API
Download this repository, unzip it there.<br>
If everything has gone alright, then try launching it!<br>
``C:\someFolder>node index.js``
You should see something like this:<br><br>
![image](https://user-images.githubusercontent.com/42903478/150342310-86c94076-257c-49bb-a1f1-71274ca5188d.png)  
And done! This is only an example, but all functions are in ```lib.js``` file.  
# Commands explanation<a name="cmds"></a>
This API supports commands just to ease life and quickly display some things.
## <a name="cmds_launching"></a>Launching commands
Insert commands here.
# <a name="changelog"></a> Changelog
## v1.0
Created new repository, some requests were made using headless browser, this version is for reworking, too much bugs.  
## v2.0
Fully remade API. Requests now doesn't require headless browser, are more stable and gathers more information.  
This is probably the final version (doesn't include minor code changes).  
