const sa = require("./lib.js");
let titleName = "Naruto";
console.log("Searching '"+titleName+"' ...");
sa.search(titleName).then((a)=>{
	console.log("Found "+a.length+" objects.");
	async function en() {
		console.log("Enumerating titles...");
		for(title in a) {
			process.stdout.write("	"+(parseInt(title)+1)+". "+a[title]["title"])
			await sa.getEpisodes(a[title]["url"]).then((titleObj)=>{
				process.stdout.write(" ["+titleObj.length+" odc] \n");
			})
				.catch(e=>console.error(e))
		}
		/*console.log("Getting episode list for first search...");
			await sa.getEpisodes(a[0]["url"]).then((titleObj)=>{
				async function ae(){
					for(title in titleObj) {
						process.stdout.write("	"+(parseInt(title)+1)+": "+titleObj[title]["title"]);
							await sa.getEpisodePlayers(titleObj[title]["url"]).then((plrs)=>{
								process.stdout.write(" ["+plrs.length+" playerów]\n");
							})
							.catch(e=>console.log(e));
					}
				}
				ae();
			})
				.catch(e=>console.log(e))
	*/}
	en();
})
	.catch(e=>console.error(e))
//sa.getEpisodePlayers("/episode/11-naruto/view/451").then((r)=>{
//	console.log("Found "+r.length+" players");
//	fetchPlayers(r);
//})
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

