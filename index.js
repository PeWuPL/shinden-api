const sa = require("./lib.js");

console.log("Fetching players...");
sa.getEpisodePlayers("/episode/11-naruto/view/451").then((r)=>{
	console.log("Found "+r.length+" players");
	fetchPlayers(r);
})
	.catch(e=>{console.log(e)});
async function fetchPlayers(t) {
	console.log("Started enumerating");
	for(tee in t) {
		console.log("["+tee+"] Fetching '"+t[tee]["player"]+"' ...")
		await sa.playerToUrl(t[tee]).then(s=>{
			console.log("Found! -> ",s)
	})
		.catch(e=>{console.log(e)});	
	}
}

