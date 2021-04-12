var shinapi = require("shinden-api");
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});
const prompt = require('prompt-sync')();

readline.question('\x1b[37mWybierz opcję:\n1. Wyszukiwarka\n2. Informacje o tytule\n3. Wyświetl komentarze\n4. Wyświetl listę odcinków\n5. Wyświetl listę playerów dla odcinka\n6. Uzyskaj adres filmu odcinka\n> \x1b[0m\x1b[31m', nr => {
	switch (nr)
	{
		case "1":
		{
			const getKeyword = prompt("\x1b[0m\x1b[37mWyszukaj słowo kluczowe: \x1b[0m\x1b[31m");
			const getPage = prompt ("\x1b[0m\x1b[37mWpisz numer strony: \x1b[0m\x1b[31m");
			console.log("\x1b[47m\x1b[7m\n\n---------------------------------------------------------------------------------------------------\n\n\x1b[0m");
			shinapi.getAnimeList(getKeyword,getPage).then((s)=>{console.log(s)})
			break;
		}
		case "2":
		{
			const getLink = prompt("\x1b[0m\x1b[37mWpisz link: \x1b[0m\x1b[31m");
			console.log("\x1b[47m\x1b[7m\n\n---------------------------------------------------------------------------------------------------\n\n\x1b[0m");
			shinapi.getDetails(getLink).then((s)=>{console.log(s)})
			break;
		}
		case "3":
		{
			const getLink = prompt("\x1b[0m\x1b[37mWpisz link: \x1b[0m\x1b[31m");
			console.log("\x1b[47m\x1b[7m\n\n---------------------------------------------------------------------------------------------------\n\n\x1b[0m");
			shinapi.getComments(getLink).then((s)=>{console.log(s)})
			break;
		}
		case "4":
		{
			const getLink = prompt("\x1b[0m\x1b[37mWpisz link: \x1b[0m\x1b[31m");
			console.log("\x1b[47m\x1b[7m\n\n---------------------------------------------------------------------------------------------------\n\n\x1b[0m");
			shinapi.getEpisodes(getLink).then((s)=>{console.log(s)})
			break;
		}
		case "5":
		{
			const getLink = prompt("\x1b[0m\x1b[37mWpisz link odcinka: \x1b[0m\x1b[31m");
			console.log("\x1b[47m\x1b[7m\n\n---------------------------------------------------------------------------------------------------\n\n\x1b[0m");
			shinapi.getPlayerList(getLink).then((s)=>{console.log(s)})
			break;
		}
		case "6":
		{
			const getLink = prompt("\x1b[0m\x1b[37mWpisz identyfikator: \x1b[0m\x1b[31m");
			console.log("\x1b[47m\x1b[7m\n\n---------------------------------------------------------------------------------------------------\n\n\x1b[0m");
			shinapi.getVideoLink(getLink).then((s)=>{console.log(s)})
			break;
		}
	}
	readline.close();
});
//shinapi.getAnimeList("bleach",1);
