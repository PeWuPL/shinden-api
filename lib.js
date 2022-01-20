const request = require("request");
const cheerio = require("cheerio");

// Response for ... responding 
const Response = function(status,message,body,token){
	this.status = status;
	this.message = message;
	if(body) this.body = body; // If body was in parameters
	if(token) this.token = token; // Shinden special token of powah!
};
var cjar = request.jar(); // Cookie jar - required for bypassing HTTP 467
// Get HTML from page
function getHTML(shindenURL,custom) {
	return new Promise((res,rej)=>{
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
				"accept-language":"pl,en-US;q=0.9,en;q=0.8"
				//"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36 OPR/82.0.4227.50",
			},
			url: "https://shinden.pl"+shindenURL,
			jar: cjar,
			method: "GET"
		};
		if(custom) {
			options["url"] = custom+shindenURL;
			//console.log(options["url"],options["jar"]);
		}
		request(options,(e,r,b)=>{
			if(e!==null) { // There are internal errors, stop executing
				let errorobj = new Response(false,"Internal error occured.",e);
				rej(errorobj);
			}
			if(r.statusCode!=200) {
				rej(new Response(false,r.statusCode));
			}
			// No internal errors, sending response code + body
			try { // Get token
				let token = /(_Storage\.basic.*)'.*'/g.exec(b);
				token = /'(.*)'/.exec(token[0]);
				res(new Response(true,r.statusCode,b,encodeURIComponent(token[1])));
			}
			catch (e) { // Do nothing, token ack failed
				res(new Response(true,r.statusCode,b));
			}
		});
	});
}

// tag to text 
function tagToUri(category,tagnr) {
	let tagUri = "";
	switch(category) {
		case 0: { // Alfabetycznie
				//tagUri="?letter=";
				switch(tagnr) {
					case "A":
						tagUri="?letter=A";
						break;
					case "B":
						tagUri="?letter=B";
						break;
					case "C":
						tagUri="?letter=C";
						break;
					case "D":
						tagUri="?letter=D";
						break;
					case "E":
						tagUri="?letter=E";
						break;
					case "F":
						tagUri="?letter=F";
						break;
					case "G":
						tagUri="?letter=G";
						break;
					case "H":
						tagUri="?letter=H";
						break;
					case "I":
						tagUri="?letter=I";
						break;
					case "J":
						tagUri="?letter=J";
						break;
					case "K":
						tagUri="?letter=K";
						break;
					case "L":
						tagUri="?letter=L";
						break;
					case "M":
						tagUri="?letter=M";
						break;
					case "N":
						tagUri="?letter=N";
						break;
					case "O":
						tagUri="?letter=O";
						break;
					case "P":
						tagUri="?letter=P";
						break;
					case "Q":
						tagUri="?letter=Q";
						break;
					case "R":
						tagUri="?letter=R";
						break;
					case "G":
						tagUri="?letter=G";
						break;
					case "S":
						tagUri="?letter=S";
						break;
					case "T":
						tagUri="?letter=T";
						break;
					case "U":
						tagUri="?letter=U";
						break;
					case "V":
						tagUri="?letter=V";
						break;
					case "W":
						tagUri="?letter=W";
						break;
					case "X":
						tagUri="?letter=X";
						break;
					case "Y":
						tagUri="?letter=Y";
						break;
					case "Z":
						tagUri="?letter=Z";
						break;
					case "#":
						tagUri="?letter=1";
						break;
					default: {
						return false;
						break;
					}
				}
			return tagUri;
			break;
		}
		default: {
			return false;
			break;
		}
	}
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
				if(titleCount==0) {
					rej("No results.");
				}
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
				console.error(e);
				throw new Error("There was some errors.");
			});
	});
}

// Getting episode data

// Related series object
var RelatedSeriesElement = function (url, imgsrc, title, animeType, titleRelation){
	this.url = url;
	this.imgsrc = imgsrc;
	this.title = title;
	this.animeType = animeType;
	this.titleRelation = titleRelation;
};
// Rating object
var RatingElement = function (rating){
	for(let i=0;i<Object.keys(rating).length;i++) {
	this[Object.keys(rating)[i]] = rating[Object.keys(rating)[i]];
	}
};
// Information object
var InformationElement = function(information){
	for(let i=0;i<Object.keys(information).length;i++) {
	this[Object.keys(information)[i]] = information[Object.keys(information)[i]];
	}
};
// Character object
var CharacterElement = function (character,actors) {
	this.character = {
		"url":character["url"],
		"name":character["name"],
		"type":character["type"],
		"img":character["imgurl"]
	};
	this.voiceActors = actors;
};
// Casting object
var CastingElement = function (url, name, imgsrc, role) {
	this.url = url;
	this.name = name;
	this.imgsrc = imgsrc;
	this.role = role;
};
// Main title info
var TitleData = function (
	title,
	titleType,
	altTitle, 
	description, 
	imgsrc, 
	tags, 
	related,
	rating,
	information,
	charactersBasic,
	stats,
	casting,
	reviews,
	recomOverall,
	recomThis,
	comments
	){
	this.title = title;
	this.titleType = titleType;
	this.altTitle = altTitle;
	this.description = description;
	this.imgsrc = imgsrc;
	this.tags = tags;
	this.related = related;
	this.rating = rating;
	this.charactersBasic = charactersBasic;
	this.stats = stats;
	this.casting=casting;
	this.reviews = reviews;
	this.recomOverall = recomOverall;
	this.recomThis = recomThis;
	this.comments = comments;
};
// Main function
function getTitle(titleUrl) {
	return new Promise((res,rej)=>{
		titleUrl = titleUrl.replace(/(^.*\.pl)(?=\/)/,"");
		getHTML(titleUrl)
			.then(outhtml=>{
				$ = cheerio.load(outhtml["body"]);
				$ = $(".l-main-contantainer"); 
				// Main page context (discard trash like scripts and ads)
				
				// Getting title
				let titleMain = $.find(".page-title").text();
				let type = titleMain.substring(0,titleMain.indexOf(":"));
				let title = titleMain.substring(titleMain.indexOf(":")+2,titleMain.length);
				let altTitle = $.find(".title-other").text().replace(/\n/g,"");
			
				// Description
				let description = $.find("#description").find("p").text();
				let imgUrl = "https://shinden.pl"+$.find(".info-aside-img").attr("src");
				// Tags
				let tagsRoot = $.find(".info-top-table-highlight");
				let finalTags = {};
				for(let i=0;i<tagsRoot.find("tr").length;i++) {
					// Getting tag keys
					let tagsCategory = tagsRoot.find("tr:eq("+i+")").find("td:eq(0)").text().replace(":","").normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace("ł","l").toLowerCase();
					// Getting actual tags
					let tagsRow = tagsRoot.find(".tags:eq("+i+")").find("li");
					let itags = [];
					for(let j=0;j<tagsRow.length;j++) {
						let tag = tagsRow.parent().find("li:eq("+j+")").text();
						itags.push(tag);
					}
					finalTags[tagsCategory] = itags;
				}
				
				// Related series
				let relatedElement = [];
				let relatedRoot = $.find(".l-container-col2 > .box > .figure-list > .relation_t2t");
				for(let i=0;i<relatedRoot.length;i++) {
					let current = relatedRoot.parent().find(".relation_t2t:eq("+i+")").find("figure");
					let rtitle = current.find("figcaption:eq(0)").find("a").attr("title");
					let rtype = current.find("figcaption:eq(1)").text();
					let rurl = "https://shinden.pl"+current.find("figcaption:eq(0)").find("a").attr("href");
					let rimgurl = "https://shinden.pl"+current.find("img").attr("src");
					let rrel = current.find("figcaption:eq(2)").text();
					
					relatedElement.push(new RelatedSeriesElement(rurl,rimgurl,rtitle,rtype,rrel));	
				}
				// Rating 
				let ratingRoot = $.find(".info-aside > .title-rates");			
				//console.log(ratingRoot.html());
				let ratingOverall = ratingRoot.find(".info-aside-rating").find(".info-aside-rating-user").text();
				let votes = ratingRoot.find("section > div > div > span").text().match(/(^.*)\d/)[0];
				let detailedRatingRoot = ratingRoot.find(".info-aside-overall-rating")
				let detailedRating = {};
				if(detailedRatingRoot.find("li").length==0) { // No ratings
					detailedRating = new RatingElement({"ogolna":[0,0],"fabula":[0,0],"grafika":[0,0],"muzyka":[0,0],"postacie":[0,0]});
				} 
				else {
					let detailedLength = detailedRatingRoot.find("li").length;
					for(let i=0;i<detailedLength;i++){
						let current = detailedRatingRoot.find("li:eq("+i+")");
						let currRating = current.text();
						let key = currRating.replace(/(^.+)\s/,"").replace("ł","l").toLowerCase();
						let currVotes = current.attr("title").match(/\d(.*)/)[0];
						currRating = currRating.replace(/\s(.*)/,"");
						detailedRating[key] = [currRating,currVotes];
					}
					detailedRating["ogolna"] = [ratingOverall,votes];
					detailedRating = new RatingElement(detailedRating);
				}
				
				// Information
				let informationRoot = $.find(".title-small-info > .info-aside-list");
				let information = {};
				let categories = informationRoot.find("dt").length;
				for(let i=0;i<categories;i++) {
					currentCat = informationRoot.find("dt:eq("+i+")").text().replace(":","").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace("ł","l");
					if(currentCat!="studio") currentVal = informationRoot.find("dd:eq("+i+")").text();
					else {
						let studioCount = informationRoot.find("dd:eq("+i+")").find("a").length;
						let studios = [];
						for(let j=0;j<studioCount;j++) {
							let currStudio = informationRoot.find("dd:eq("+i+")").find("a:eq("+j+")").text();
							studios.push(currStudio);
						}
						currentVal=studios;
					}
					information[currentCat] = currentVal;
				}
				information = new InformationElement(information);
				
				// Characters
				let characters = [];
				let charactersRoot = $.find(".page-content > div > .box > .ch-st-list");
				let characterCount = charactersRoot.find(".ch-st-item").length;
				for (let i=0;i<characterCount;i++) {
					let charItem = charactersRoot.find(".ch-st-item:eq("+i+")").find(".item-l");
					let character = {};
					character["url"] = "https://shinden.pl"+charItem.find("a").attr("href");
					character["name"] = charItem.find(".p-txt").find("a").text();
					character["type"] = charItem.find(".p-txt").find("p").text();
					character["imgurl"] = "https://shinden.pl"+charItem.find(".img > img").attr("src");
					
					let actItem = charactersRoot.find(".ch-st-item:eq("+i+")");
					let actors = [];
					let actorCount = actItem.find(".item-r").length;
					for(let j=0;j<actorCount;j++) {
						let currentActor = actItem.find(".item-r:eq("+j+")");
						let actor = {};
						actor["url"] = "https://shinden.pl"+currentActor.find("h3").find("a").attr("href");
						actor["name"] = currentActor.find("h3 > a").text();
						actor["country"] = currentActor.find(".p-txt > p").text();
						actor["imgurl"] = "https://shinden.pl"+currentActor.find(".img").attr("href");
						actors.push(actor);
					}
					characters.push(new CharacterElement(character,actors))
				}
				
				// Statistics
				let statisticsRoot = $.find(".title-stats > .info-aside-list");
				let statistics = {};
				for(let i=0;i<statisticsRoot.find("dt").length;i++) {
					let category = statisticsRoot.find("dt:eq("+i+")").text().replace(" ","").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace("ł","l");
					let value = statisticsRoot.find("dd:eq("+i+")").text();
					let obj = {};
					statistics[category] = value;
				}
				
				// Casting
				let casting = [];
				let castingRoot = $.find(".page-content ").find(".box > .person-list");
				for (let i=0;i<castingRoot.find("div").length;i++) {
					let currPerson = castingRoot.find("div:eq("+i+")").find(".person-one");
					// url, nazwa, obrazek, rola
					let currImgUrl = "https://shinden.pl"+currPerson.find(".character").attr("src");
					let currName = currPerson.find("h3 > a").text().replace("\n","");
					currName = currName.substring(0,currName.length-1);
					let currUrl = "https://shinden.pl"+currPerson.find("h3 > a").attr("href");
					let currRole = currPerson.find("p").text();
					casting.push(new CastingElement(currUrl,currName,currImgUrl,currRole));
				}
				
				// Reviews
				let reviews = [];
				let reviewsRoot = $.find(".l-container-col2").find(".box-texts").find("section:eq(0)");
				let moreReviewsUrl = "https://shinden.pl"+reviewsRoot.find(".box-more").find("a").attr("href");
				let reviewCount = reviewsRoot.find("ul > .media").length;
				for(let i=0;i<reviewCount;i++) {
					let currRoot = reviewsRoot.find(".media-list > li:eq("+i+")");
					let review = {};
					review["imgurl"] = "https://shinden.pl"+currRoot.find(".img > img").attr("src");
					review["username"] = currRoot.find("div > .media > .bd > .media-header > a").text();
					review["userurl"] = "https://shinden.pl"+currRoot.find("div > .media > .bd > .media-header > a").attr("href");
					let currStatsRoot = currRoot.find("div > .media > .img");
					let stats = {};
					stats["views"] = currStatsRoot.find("figure:eq(0)").find("figcaption").text().replace("\n","").trim();
					stats["reads"] = currStatsRoot.find("figure:eq(1)").find("figcaption").text().replace("\n","").trim();
					stats["likes"] = currStatsRoot.find(".binary-rate:eq(0)").find("figure").find("figcaption").text().replace(/\n/g,"").trim();
					stats["dislikes"] = currStatsRoot.find(".binary-rate:eq(1)").find("figure").find("figcaption").text().replace(/\n/g,"").trim();
					review["stats"] = stats;
					review["content"] = currRoot.find("div").find("p").text().replace(/\n/g,"").trim();
					review["fullUrl"] = "https://shinden.pl"+currRoot.find(".box-more").find("a").attr("href");
					reviews.push(review);
				}
				
				// Recommendations
				let recommendations = [];
				let recomRoot = $.find(".l-container-col2").find(".box-texts").find("section:eq(1)").find("ul:eq(0)");
				let recomCount = recomRoot.find(".media-item").length;
				for(let i=0;i<recomCount;i++) {
					let currRoot = recomRoot.find(".media-item:eq("+i+")");
					let recom = {};
					recom["imgurl"] = "https://shinden.pl"+currRoot.find("img.media-title-cover").attr("src");
					recom["titleUrl"] = "https://shinden.pl"+currRoot.find("div").find(".box-art-title").find("a").attr("href");
					recom["titleName"] = currRoot.find("div").find(".box-art-title").find("a").text();
					recom["authorUrl"] = "https://shinden.pl"+currRoot.find(".clearfix").find(".bd").find("h3").find("a").attr("href");
					recom["authorName"] = currRoot.find(".clearfix").find(".bd").find("h3").find("a").text();
					if(recom["authorName"]=="") recom["authorimgurl"] = currRoot.find(".clearfix").find("div").find("img").attr("src");
					else recom["authorimgurl"] = "https://shinden.pl"+currRoot.find(".clearfix").find("div").find("img").attr("src");
					recom["likes"] = currRoot.find(".clearfix").find(".imgExt").find("a:eq(0)").find("figcaption").find("span").text();
					recom["dislikes"] = currRoot.find(".clearfix").find(".imgExt").find("a:eq(1)").find("figcaption").find("span").text();
					recom["content"] = currRoot.find(".bd > p:eq(1)").text();
					if(currRoot.find(".bd > ul").length!=0) {
						let rootCopy = cheerio.load(currRoot.html());
						rootCopy(".bd > h3").remove();
						rootCopy(".box-art-text").remove();
						rootCopy(".bd > p").remove();
						rootCopy(".bd > ul").remove();
						rootCopy(".bd > br").remove();
						rootCopy(".bd > .img").remove();
						rootCopy(".bd").find(".bd").remove();
						rootCopy(".bd").find(".imgExt").remove();
						rootCopy(".bd").find(".clearfix").remove();
						rootCopy = rootCopy(".bd").text().trim();
						rootCopy = rootCopy.split("\n")
						let extraContent =[];
						let extraContentRoot = currRoot.find("div > ul");
						for (let j=0; j<extraContentRoot.find("li").length;j++) {
							let currContent = extraContentRoot.find("li:eq("+j+")").text();
							extraContent.push(currContent);
						}
						extraContent.push(...rootCopy);
						recom["extraContent"] = extraContent;
					}
					recommendations.push(recom);
				}
				
				// Recommendations to this title
				let recomToThis = [];
				let recomToThisRoot = $.find(".l-container-col2").find(".box-texts").find("section:eq(1)").find(".media-list:eq(1)");
				for(let i=0;i<recomToThisRoot.find(".media-item").length;i++) {
					let currRoot = recomToThisRoot.find(".media-item:eq("+i+")");
					let recom = {};
					recom["imgurl"] = "https://shinden.pl"+currRoot.find("img.media-title-cover").attr("src");
					recom["titleUrl"] = "https://shinden.pl"+currRoot.find("div").find(".box-art-title").find("a").attr("href");
					recom["titleName"] = currRoot.find("div").find(".box-art-title").find("a").text();
					recom["authorUrl"] = "https://shinden.pl"+currRoot.find(".clearfix").find(".bd").find("h3").find("a").attr("href");
					recom["authorName"] = currRoot.find(".clearfix").find(".bd").find("h3").find("a").text();
					if(recom["authorName"]=="") recom["authorimgurl"] = currRoot.find(".clearfix").find("div").find("img").attr("src");
					else recom["authorimgurl"] = "https://shinden.pl"+currRoot.find(".clearfix").find("div").find("img").attr("src");
					recom["likes"] = currRoot.find(".clearfix").find(".imgExt").find("a:eq(0)").find("figcaption").find("span").text();
					recom["dislikes"] = currRoot.find(".clearfix").find(".imgExt").find("a:eq(1)").find("figcaption").find("span").text();
					recom["content"] = currRoot.find(".bd > p:eq(1)").text();
					if(currRoot.find(".bd > ul").length!=0) {
						let rootCopy = cheerio.load(currRoot.html());
						rootCopy(".bd > h3").remove();
						rootCopy(".box-art-text").remove();
						rootCopy(".bd > p").remove();
						rootCopy(".bd > ul").remove();
						rootCopy(".bd > br").remove();
						rootCopy(".bd > .img").remove();
						rootCopy(".bd").find(".bd").remove();
						rootCopy(".bd").find(".imgExt").remove();
						rootCopy(".bd").find(".clearfix").remove();
						rootCopy = rootCopy(".bd").text().trim();
						rootCopy = rootCopy.split("\n")
						let extraContent =[];
						let extraContentRoot = currRoot.find("div > ul");
						for (let j=0; j<extraContentRoot.find("li").length;j++) {
							let currContent = extraContentRoot.find("li:eq("+j+")").text();
							extraContent.push(currContent);
						}
						extraContent.push(...rootCopy);
						recom["extraContent"] = extraContent;
					}
					recomToThis.push(recom);
				}
				
				// Comments
				let comments = [];
				let commentsRoot = $.find(".posts-last").find(".posts");
				let moreCommentsUrl = $.find(".posts-last").find(".more-link > a").attr("href");
				comments.push({"moreComments":moreCommentsUrl});
				let commentsCount = commentsRoot.find("li").length;
				for (let i=0;i<commentsCount;i++) {i
					let comment = {};
					let currComment = commentsRoot.find("li:eq("+i+")");
					comment["author"] = currComment.find("summary > strong").text();
					comment["authorUrl"] = "https://shinden.pl"+currComment.find(".av-rank").attr("href");
					comment["authorimgurl"] = "https://shinden.pl"+currComment.find(".av-rank").find("a").attr("src");
					comment["rank"] = currComment.find(".av-rank").find(".rank").text();
					comment["id"] = currComment.find("details > summary.post-id > a").text();
					comment["threadUrl"] = currComment.find("details > summary.post-id > a").attr("href");
					comment["timeAgo"] = currComment.find(".timeago").text();
					comment["content"] = currComment.find(".reply").text().replace("\n","");
					comments.push(comment);
				}
				let titleFull = new TitleData(title, type, altTitle, description, imgUrl, finalTags, relatedElement, detailedRating, information, characters, statistics, casting, reviews, recommendations, recomToThis, comments);
				res(titleFull);
			})
			.catch(e=>{
				rej(e);
			});
	});
}
var Episode = function (url, title, number, online, offline, filler, langs, date){
	this.url = url;
	this.title=title;
	this.number = number;
	if(online==1) this.online = true;
	if(offline) this.offline = true;
	if(filler) this.filler = true;
	this.langs = langs;
	this.date = date;
}

function getEpisodes(titleUrl) {
	titleUrl = titleUrl.replace(/(^.*\.pl)(?=\/)/,"");
	return new Promise((res,rej)=>{
		if(!titleUrl.includes("/all-episodes"))
			titleUrl+="/all-episodes";
		getHTML(titleUrl).then((outhtml)=>{
			let $ = cheerio.load(outhtml["body"]);
			$ = $(".page-content");
			let episodes = [];
			let episodesRoot = $.find(".table-responsive");
			let episodeCount = episodesRoot.find(".list-episode-checkboxes").find("tr").length;
			for(let i=episodeCount-1;i>=0;i--){
				let episodeRoot = episodesRoot.find(".list-episode-checkboxes").find("tr:eq("+i+")");
				let url = "https://shinden.pl"+episodeRoot.find(".button-group > a").attr("href");
				let title = episodeRoot.find(".ep-title").text();
				let number = episodeRoot.find("td:eq(0)").text();
				let online,offline,filler;
				if(episodeRoot.find(".fa-check").length==1) online = episodeRoot.find(".fa-check").length;
				if(episodeRoot.find(".fa-times").length==1) offline = episodeRoot.find(".fa-times").length;
				if(episodeRoot.find(".fa-facebook").length==1) filler = episodeRoot.find(".fa-facebook").length;
				let langs = [];
				let langsRoot=episodeRoot.find("td > .flag-icon");
				let langsCount=langsRoot.parent().find(".flag-icon").length;
				for(let j=0;j<langsCount;j++) {
					let currRoot = langsRoot.parent().find(".flag-icon:eq("+j+")");
					langs.push(currRoot.attr("title"));
				}
				let emissionDate = episodeRoot.find(".ep-date").text();
				episodes.push(new Episode(url,title,number,online,offline,filler,langs,emissionDate));
			}
			res(episodes);
		})
			.catch(e=>{
				rej(e);
			})
	});
}
// Player object
var Player = function (id,player,uploader,subAuthor,audioLang,subLang,quality,addingDate,source) {
	this.id=id;
	this.player=player;
	this.uploader=uploader;
	this.subAuthor=subAuthor;
	this.audioLang = audioLang;
	this.subLang = subLang;
	this.quality = quality;
	this.date = addingDate;
	this.source = source;
}

function getEpisodePlayers(episodeUrl) {
	episodeUrl = episodeUrl.replace(/(^.*\.pl)(?=\/)/,"");
	return new Promise((res,rej)=>{
		getHTML(episodeUrl).then((outhtml)=>{
			let $ = cheerio.load(outhtml["body"]);
			let titleContext = $(".episode-head").html();
			let titleElement = cheerio.load(titleContext,null,false);
			titleElement(".pull-right").remove();
			titleElement("small").remove();
			let title = titleElement.html().trim();


			let playerListRoot = $(".episode-player-list > .table-responsive > .data-view-hover > tbody");
			let playerCount = playerListRoot.find("tr").length;
			let players = [];
			for(let i=0;i<playerCount;i++) {
				let currPlayer = playerListRoot.find("tr:eq("+i+")");
				let playerData = currPlayer.find(".change-video-player").attr("data-episode");
				playerData = JSON.parse(playerData);
				delete playerData["username"]// It's empty anyways
				players.push(new Player(playerData["online_id"],playerData["player"],playerData["user_id"],playerData["subs_author"],playerData["lang_audio"],playerData["lang_subs"],playerData["max_res"],playerData["added"],playerData["source"]));
			}
			res(players);
		})
			.catch(e=>rej(e));
	});
}
//Token getting
function tokenizer() {
	return new Promise ((res,rej)=>{
		getHTML("/")
			.then(h=>{
				res(h["token"]);
			})
			.catch(e=>rej(e));
	});
}
function playerToUrl (player) {
	return new Promise((res,rej)=>{
		let xhrBase = "https://api4.shinden.pl/xhr";
		if(typeof player != "object") rej("Incorrect player object");
		let playerId = player["id"];
		// Acquiring token
		tokenizer().then((token)=>{
			getHTML(playerId+"/player_load?auth="+token,xhrBase).then(r=>{ // Getting loading seq
				setTimeout(()=>{
					getHTML(playerId+"/player_show?auth="+token,xhrBase).then(s=>{
						let playerBody = cheerio.load(s["body"]);
						switch(player["player"].toLowerCase()) {
							default: {
								let url = playerBody("iframe").attr("src");
								if(!url.includes("https:")) url= "https:"+url;
								res(url);
								break;
							}
						}
					}).catch(e=>rej(e));
				},5000)
			}).catch(e=>rej(e));
		});
	});
}
module.exports.playerToUrl = playerToUrl;
module.exports.getEpisodePlayers = getEpisodePlayers;
module.exports.getEpisodes = getEpisodes;
module.exports.getTitle = getTitle;
module.exports.search = search;
module.exports.getHTML = getHTML;


