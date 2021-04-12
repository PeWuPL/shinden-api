const shinapi = require("shinden-api");
const util = require("util");
const first = process.argv[2]; // Argumenty
const second = process.argv[3];// Url-e
const third = process.argv[4]; // Szczegóły
const forth = process.argv[5]; // Login
const fifth = process.argv[6]; // Hasło
util.inspect.defaultOptions.maxArrayLength = null;
if(!first)
{
	console.log("No argument specified! Type \x1b[31mnode api.js -h\x1b[0m\x1b[37m for help.");
}
else
{
	switch(first)
	{
		case "-h":
		{
			console.log('\x1b[31m%s\x1b[0m', "API made by PeWu");
			console.log("Usage: api.js [command] [needed_arg] (optional_params)");
			console.log("Modes: \x1b[33m%s\x1b[0m\x1b[37m%s","-h",": Displays this help");
			console.log("       \x1b[33m%s\x1b[0m\x1b[37m%s","-s",": Search mode. args: [word] (page)");
			console.log("       \x1b[33m%s\x1b[0m\x1b[37m%s","-i",": Information mode. args: [title_url] (type)");
			console.log("\x1b[36m%s\x1b[0m\x1b[37m","Example of 'title_url': https://shinden.pl/series/246-bleach");
			console.log("\x1b[36m%s\x1b[0m\x1b[37m","'type' list: title, description, tags, related, rating, info, stats");
			console.log("       \x1b[33m%s\x1b[0m\x1b[37m%s","-c",": Comment listing mode. args: [url]");
			console.log("       \x1b[33m%s\x1b[0m\x1b[37m%s","-e",": Episode listing mode. args: [url] (episode_nr) <username> <password>");
			console.log("\x1b[36m%s\x1b[0m\x1b[37m","In some rare cases, shinden.pl does not display all resources to not signed in people.");
			console.log("\x1b[36m%s\x1b[0m\x1b[37m","You may need this if content is not loaded.");
			console.log("       \x1b[33m%s\x1b[0m\x1b[37m%s\x1b[0m\x1b[37m","-p",": Player ID's listing mode. args: [episode_url]");
			console.log("\n\x1b[7m%s\x1b[0m\x1b[37m","=========Disabled modes for now:=========");
			console.log("\x1b[36mExample of 'episode_url': https://shinden.pl/episode/246-bleach/view/6794");
			console.log("       \x1b[33m%s\x1b[0m\x1b[37m%s\x1b[0m\x1b[37m","-g",": Player links listing mode. args: [player_id] [API_key]");
			console.log("\x1b[36m%s\x1b[0m\x1b[37m","Example of 'player_id': 510080");
			console.log("\x1b[36m%s\x1b[0m\x1b[37m","Example of 'API_key': UGVXdToyNjM2MzAsNSwyMDIxMDQxMTA3LDMsOTI2MjQ1MjU2");
			console.log("\x1b[31m\x1b[7m%s\x1b[0m\x1b[37m","You need to obtain API_key in order to work.");
			break;
		}
		case "-i":
		{
			if (second)
			{
				if(third&&(third=="title"||third=="description"||third=="tags"||third=="related"||third=="rating"||third=="info"||third=="stats")) 
				{
					shinapi.getDetails(second).then((s)=>{console.log(s[third])})
					
				}
				else if(!third) shinapi.getDetails(second).then((s)=>{console.log(s)})
				else console.log("Unknown '"+third+"' argument.");
			}
			else
			{
				console.log("No URL specified.");
			}
			break;
		}
		case "-s":
		{
			if (second)
			{
				
				if(!third) shinapi.getAnimeList(second).then((s)=>{console.log(s)})
				else shinapi.getAnimeList(second,third).then((s)=>{console.log(s)})
			}
			else
			{
				console.log("No keyword specified.");
			}
			break;
		}
		case "-e":
		{
			if (second)
			{
				if(third) 
				{
					if (forth&&fifth)
					{
						shinapi.getEpisodes(second,parseFloat(third),forth,fifth).then((s)=>{console.log(s)})
					}
					else shinapi.getEpisodes(second,parseFloat(third)).then((s)=>{console.log(s)})
				}
				else shinapi.getEpisodes(second).then((s)=>{console.log(s)})
			}
			else
			{
				console.log("No URL specified.");
			}
			break;
		}
		case "-c":
		{
			if (second)
			{
				shinapi.getComments(second).then((s)=>{console.log(s)})
			}
			else
			{
				console.log("No URL specified.");
			}
			
			break;
		}
		case "-p":
		{
			if (second)
			{
				if (third&&forth)
				shinapi.getPlayerList(second,third,forth).then((s)=>{console.log(s)})
				else
				shinapi.getPlayerList(second).then((s)=>{console.log(s)})
			}
			else
			{
				console.log("No URL specified.");
			}
			break;
		}
		case "-g":
		{
			if(0==1)
			{
			if (second)
			{
				if(third) shinapi.getVideoLink(second,third).then((s)=>{console.log(s)})
				else console.log("You need API key.");
			}
			else
			{
				console.log("No URL specified.");
			}
			}
			else
			{
				console.log("FEATURE DISABLED FOR NOW.");
			}
			break;
		}
		default:
		{
			console.log("Unknown '"+first+"' argument.");
			break;
		}
	}
}
//