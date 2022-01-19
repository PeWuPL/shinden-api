const request = require("request");
const cheerio = require("cheerio");

// Response for ... responding 
const Response = function(status,message,body){
	this.status = status;
	this.message = message;
	if(body) this.body = body; // If body was in parameters
};

// Get HTML from page
function getHTML(shindenURL) {
	return new Promise((res,rej)=>{
		let cjar = request.jar(); // Cookie jar - required for bypassing HTTP 467
		if(typeof shindenURL !== "string") {
			rej(new Response(false,"URL is not a string!")); // incorrect URL
			return;
		}
		if(shindenURL=="") shindenURL="/" // If empty, go with the slash
		if(shindenURL[0]!=="/") { // No backslash at the beginning, just add it
			shindenURL = "/"+shindenURL;
		}
		//shindenURL = encodeURIComponent(shindenURL); // Encoding URI for future usage
		let options = {
			headers: {
				//"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36 OPR/82.0.4227.50",
			},
			url: "https://shinden.pl"+shindenURL,
			jar: cjar,
			method: "GET"
		};
		request(options,(e,r,b)=>{
			if(e!==null) { // There are internal errors, stop executing
				let errorobj = new Response(false,"Internal error occured.",e);
				rej(errorobj);
			}
			// No internal errors, sending response code + body
			res(new Response(true,r.statusCode,b));
		});
	});
}

// Object for searched content
var TitleSearch = function(url,title,tags,img,type,episodes,rating,status,topranking){
	this.url=url;								// URL tytułu
	this.title=title;						// Tytuł
	this.tags=tags;							// Tagi
	this.img=img;								// URL obrazka
	this.type=type;							// Typ serii
	this.episodes=episodes;			// Odcinki
	this.rating=rating;					// Oceny
	this.status=status;					// Status serii
	this.topranking=topranking;	// Ranking TOP
};

// Scrap search from page
function search(word,page,tags,oneorall=true) {
	return new Promise((res,rej)=>{
		let finalq = "";
		if(word&&word!="") {
			word=encodeURIComponent(word);
			finalq+="?search="+word;
		}
		if(page)
			finalq+="?page="+page;
		if(oneorall&&tags)
			finalq+="?genres-type=one";
		if(tags){ //TAG NUMBERS HERE!!
			let convertedTags;
			finalq+="?tags="+convertedTags;
		}
		getHTML("/series"+finalq) // Getting HTML
			.then(r=>{
				let $ = cheerio.load(r["body"]);
				// Pages
				let pagination = $(".anime-list > nav:eq(0)");
				let pageCount = pagination.find("li:eq("+(pagination.find("li").length-3)+")").text();
				// Enumerating titles to objects
				let titles=[];
				let titleRoot = $(".anime-list > .title-table > article ");
				let titleCount = titleRoot.find("ul.div-row").length;
				//console.log(titleCount);
				for(let i=0;i<titleCount;i++) {
					
					// title photo
					let photourl = titleRoot
						.find("ul.div-row:eq("+i+")")
						.find("li.cover-col")
						.find("a")
						.attr("style");
					if(photourl.match(/\((.*?)\)/)[1]) {
						photourl="https://shinden.pl"+photourl.match(/\((.*?)\)/)[1];
					}	
					
					// title name
					let titlename = titleRoot
						.find("ul.div-row:eq("+i+")")
						.find("li.desc-col")
						.find("h3")
						.find("a")
						.text();
					
					// title url
					let titleurl = "https://shinden.pl"+titleRoot
						.find("ul.div-row:eq("+i+")")
						.find("li.desc-col")
						.find("h3")
						.find("a")
						.attr("href");
					
					// title tags
					let tags = titleRoot
						.find("ul.div-row:eq("+i+")")
						.find("li.desc-col")
						.find(".tags");
					let tagCount = tags.find("li").length;
					let tagelems = [];
					for(let j=0;j<tagCount;j++) {
						let etags = tags.find("li:eq("+j+")").find("a").text();
						tagelems.push(etags);
					}

					// title type
					let type = titleRoot
						.find("ul.div-row:eq("+i+")")
						.find(".title-kind-col").text();

					// title no of episodes (+ episode length)
					let episodes = titleRoot // get episodes and remove whitespaces
						.find("ul.div-row:eq("+i+")")
						.find(".episodes-col").text().replace(/\s/g,"");
					if(episodes.match(/\d/g)==null) // if episodes nr are empty
						episodes=null
					let episodesLength = titleRoot
						.find("ul.div-row:eq("+i+")")
						.find(".episodes-col").attr("title");

					// ratings
					let ratingsArr = [];
					let ratingsRoot = titleRoot
						.find("ul.div-row:eq("+i+")")
						.find(".ratings-col")
					if(ratingsRoot.length==0) // No ratings
						ratings=null;
					ratingsArr.push(ratingsRoot.find(".rating-total").find("span").text())
					ratingsArr.push(ratingsRoot.find(".rating-story").find("span").text())
					ratingsArr.push(ratingsRoot.find(".rating-graphics").find("span").text())
					ratingsArr.push(ratingsRoot.find(".rating-music").find("span").text())
					// cAHracters XDDD
					ratingsArr.push(ratingsRoot.find(".rating-titlecahracters").find("span").text())
					
					// title status
					let status = titleRoot
						.find("ul.div-row:eq("+i+")")
						.find(".title-status-col").text();

					// title TOP rating
					let top = titleRoot
						.find("ul.div-row:eq("+i+")")
						.find(".rate-top").text();
					
					// inserting into main title object
					titles.push(new TitleSearch(
						titleurl,
						titlename,
						tagelems,
						photourl,
						type,
						episodes,
						ratingsArr,
						status,
						top
					));
				}
				res(titles);
			})
			.catch(e=>{ // In case of error

			});
	});
}
search("");
module.exports.getHTML = getHTML;


