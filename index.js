var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const pt = require('puppeteer');
var base_url = "https://shinden.pl/";
var debug = false;
// Do eksportu


// getAnimeList()
var anime_search_list = new Array(); // Wyszukiwarka - Lista

// getDetails()
var details_title; // Szczegóły - Tytuł
var details_desc; // Szczegóły - Opis
var details_tags = {}; // Szczegóły - Tagi
var details_related = new Array(); // Szczegóły - Powiązane
var details_rating = {}; // Szczegóły - Oceny
var details_info = {}; // Szczegóły - Informacje
var details_stats = {}; // Szczegóły - Statystyki
var details_characters = []; // Szczegóły - Postacie

// getEpisodes()
var episodes_list = new Array(); // Odcinki - Lista
// getPlayerList()
var player_list = new Array(); // Odtwarzacze - Lista
// getVideoLink()
var player_link; // Odtwarzacz - Link
// getComments()
var comment_list = new Array(); // Komentarze - Lista

console.log('\x1b[37m\x1b[7m%s\x1b[0m', "==========================================SHINDEN PENETRATOR=======================================");
function getAnimeList(keyword, page_nr) {
    let promise2 = new Promise(function (resolve, reject) {
        // Pobiera listę z szukanej frazy i wyświetla linki oraz tytuły
        // Ma trochę dziur, ale dopiero zaczynam przygodę z programowaniem :I
        keyword = keyword.replace(/\s/g, "+").replace(/_/, "+");
        if (page_nr == '' || page_nr == null)
            page_nr = 1;
        console.log("\x1b[33mshinden-api\x1b[0m\x1b[37m: Searching for '\x1b[31m" + keyword + "\x1b[0m\x1b[37m' on '\x1b[31m" + base_url + "\x1b[0m\x1b[37m' (page " + page_nr + ")...");
        function cb(u, url) { // Funkcja Callback - Wywoływana przy wykonaniu funkcji asynchronicznej.
            if (debug)
                console.log("\x1b[33mshinden-api\x1b[0m\x1b[37m: Scraping page \x1b[31m" + url + "\x1b[0m\x1b[37m");
            var elementList = new Array(); // Tablica dla elementów wyszukiwania
            var titleList = new Array(); // Tablica dla linków
            var begin = '</i></a>\n</li>\n<li class="pagination-next">';
            var end = '</li>\n </ul>';
            //console.log(u);
            var pages = crop(u, begin, end, false);
            try {
                pages = pages.replace(/^([^\n]+)/, "").match(/(?<=")(.*)(?=")/)[0].match(/(?<==)(.*)(?=")/)[0].match(/(?<==)(.*)(?=")/)[0];
            } catch (err) {
                // Wychodzi na to, że jest tylko jedna strona wyniku.
                pages = 1;
            }
            begin = '<article>';
            end = '</section>';
            var cropped = crop(u, begin, end, true); // Uzyskanie ogólnego zbioru anime


            for (var i = 0; i < 10; i++) // Pozyskiwanie każdego elementu anime
            {
                var begin = '<ul class="div-row">';
                var end = '</li>\n</ul>';
                elementList[i] = crop(cropped, begin, end, true); // Dzielenie na elementy
                cropped = cropped.replace(elementList[i], ''); // Usuwanie już zapisanego elementu z ogólnego zbioru
            }

            for (var i = 0; i < 10; i++) // Pozyskiwanie tytułu z linkiem
            {
                begin = "<h3> <a href=";
                end = '</a></h3>';
                elementList[i] = crop(elementList[i], begin, end, false); // Uzyskiwanie linku wraz z tytułem
                elementList[i] = elementList[i].replace(/(<([^>]+)>)/gi, ""); // Usuwanie tagów HTML
                elementList[i] = elementList[i].replace(">", " "); // Usunięcie ostatniej ostrej klamry
                titleList[i] = elementList[i].replace(/(")(.*?)\1/, ""); // Usunięcie linku z tytułu
                elementList[i] = elementList[i].replace(titleList[i], ""); // Usunięcie tytułu z linku
                titleList[i] = titleList[i].replace(/^\s+/gm, ""); // Usunięcie spacji
                elementList[i] = elementList[i].replace('"', '"' + base_url.replace("pl/", "pl")); // Usunięcie początkowego cudzysłowia, wstawienie w jego miejsce adresu domowego Shindena
                elementList[i] = elementList[i].replace(/"/g, "");
            } {
                if (debug)
                    console.log("\x1b[33mshinden-api\x1b[0m\x1b[37m: SCRAPING COMPLETE!\n---------------------------------------------------------------------------------------------------");
                console.log("Page " + page_nr + " of " + pages + ".");
                for (i = 0; i < elementList.length; i++) {
                    if (elementList[i] != "") {
                        anime_search_list[i] =
                            [// Przypisanie tytułów i linków do tablicy
                            titleList[i],
                            elementList[i]
                        ];
                    }
                    if (anime_search_list.length == 0)
                        anime_search_list = "Brak wyników";
                }
            }
            //console.log(anime_search_list);

            return anime_search_list; // Zwróć listę elementów do funkcji nadrzędnej - NIE DZIAŁA
        };
        var addit_url = "series?search=" + keyword + "&page=" + page_nr; // Dodatkowe tagi linku
        var full_url = base_url + addit_url;
        //let promise = new Promise(function(res,rej){res()}).then(console.log("f"));
        let promise = new Promise(function (resolve, reject) {
            resolve(getReq(full_url, "GET"));
        });
        let xf;
        promise.then((s) => {
            xf = cb(s[0], s[1])
        }).finally(() => {
            resolve(xf)
        });
    });
    return promise2;
}
function getDetails(url) {
    let promise2 = new Promise(function (resolve, reject) {
        // Pobiera listę szczegółów dotyczące danego anime
        if (debug)
            console.log("\x1b[33mshinden-api\x1b[0m\x1b[37m: Getting details for '\x1b[31m" + url + "\x1b[0m\x1b[37m' on '\x1b[31m" + base_url + "\x1b[0m\x1b[37m'...");
        function cb(u, url) { // Funkcja Callback - Wywoływana przy wykonaniu funkcji asynchronicznej.
            //console.log("---------------------------------------------------------------------------------------------------");
            //==================================================================================================================================
            // Wyświetlanie opisu
            var begin = '<h1 class="page-title">';
            var end = '</h1>';
            details_title = crop(u, begin, end, false);
            //console.log(title);
            begin = '<meta name="description" content="';
            end = '">';
            details_desc = crop(u, begin, end, false);
            details_desc = details_desc /* Zamiana encji na normalne znaki*/
                .replace(/&oacute;/g, "ó")
                .replace(/&quot;/g, "'")
                .replace(/&hellip;/g, ".")
                .replace(/&rsquo;/g, '"')
                .replace(/&nbsp;/g, " ")
                .replace(/&bdquo;/g, '"')
                .replace(/&rdquo;/g, '"')
                .replace(/&ndash;/g, '"');
            //console.log("---------------------------------------------------------------------------------------------------");
            if (details_desc != "NO INFO!") {
                details_desc = "Opis: " + details_desc + "\n";
                details_desc = details_desc.replace(/\n/g, "");

                // DZIELENIE OPISU CO n ZNAKÓW
                var f_desc = details_desc.match(/(.{95})/g); // Dzielenie co 95 znaków
                if (f_desc != null)
                    var g_desc = f_desc.join(""); // Łaczenie jej,
                g_desc = details_desc.replace(g_desc, ""); // aby pokazać, że brakuje końcówki.
                if (f_desc != null) {
                    f_desc[f_desc.length] = g_desc; // Pokazanie końcówki
                    for (var i = 0; i < f_desc.length - 1; i++)
                        f_desc[i] = addStr(f_desc[i],
                                f_desc[i].lastIndexOf(" ",
                                    f_desc[i].length - 1),
                                "\n");
                    // Dla każdego wyniku, znajdź od końca spację i dodaj łamanie linii
                }
                if (f_desc != null)
                    details_desc = f_desc.join(""); // Na końcu wszystko połącz.
                //console.log(details_desc);			// Oraz wyświetl.
            } else {
                //console.log("Opis: BRAK"); 			// Jeśli nie znaleziono opisu
                details_desc = "Opis: BRAK";
            }
            //console.log("---------------------------------------------------------------------------------------------------");
            //==================================================================================================================================
            // Tagi
            //console.log("Tagi:");
            // Uzyskanie tagów
            begin = '<tbody class="info-top-table-highlight">';
            end = '</tr>\n</tbody>';
            var tags_element = crop(u, begin, end, true); // Ogólny element tagów
            // Nazwy tagów
            var tag_cat = ["Gatunki", "Grupy docelowe", "Pozostale tagi", "Rodzaje postaci", "Miejsce i czas", "Pierwowzor"];
            tags = { // Tagi
                "Gatunki": new Array(),
                "Grupy docelowe": new Array(),
                "Pozostale tagi": new Array(),
                "Rodzaje postaci": new Array(),
                "Miejsce i czas": new Array(),
                "Pierwowzor": new Array()
            };
            var tag_group_element; // Element grupowy dla poszczególnych tagów
            for (var i = 0; i < tag_cat.length; i++) {
                begin = '<tr>\n<td>' + tag_cat[i] + ':</td>\n<td>\n<ul class="tags">';
                end = '</td>';
                tag_group_element = crop(tags_element, begin, end, false); // Zawężanie do pojedynczych elementów kategorii taga
                tag_group_element = tag_group_element.replace(/(<([^>]+)>)/gi, "").split('\n').filter(value => Object.keys(value).length !== 0); // Pozbycie się niepotrzebnych pustych wyników z tablicy
                details_tags[tag_cat[i]] = tag_group_element; // Łaczenie tablic w tablicę z indeksem słownym
                if (tag_group_element == "NO INFO!")
                    delete details_tags[tag_cat[i]]; // Pozbycie się elementów typu "NO INFO!"
            }
            //console.log(details_tags); // Wyświetlanie tagów
            //console.log("---------------------------------------------------------------------------------------------------");
            //==================================================================================================================================
            // Powiązane serie
            //console.log("Powiązane serie:");
            // Uzyskanie głównego elementu
            begin = '<ul class="figure-list figure-scrollable box-scrollable-x">';
            end = '</figure>\n</li>\n</ul>\n</section>';
            var related_main_element = crop(u, begin, end, false);
            // Pobranie pojedynczego obiektu
            var related_tmp;
            if (related_main_element != "NO INFO!") {
                // Rekonstrukcja HTML -> []
                for (var i = 0; i < related_main_element.match(/<li class="relation_t2t">/g).length; i++) {
                    details_related[i] = {
                        "type": "",
                        "title": "",
                        "relatability": "",
                        "link": ""
                    };
                }
                for (var i = 0; i < details_related.length; i++) {
                    // Krojenie na części głównego elementu
                    begin = '<li class="relation_t2t">';
                    end = '</li>';
                    related_tmp = crop(related_main_element, begin, end, true);
                    related_main_element = related_main_element.replace(related_tmp, "");

                    // Uzyskanie linku
                    begin = '<figcaption>\n<a href="/';
                    end = '" title="';
                    details_related[i]["link"] = base_url + crop(related_tmp, begin, end, false);
                    // Uzyskanie tytułu
                    begin = '" title="';
                    end = '">\n';
                    details_related[i]["title"] = crop(related_tmp, begin, end, false);
                    // Uzyskanie typu
                    begin = 'figcaption class="figure-type">';
                    end = '</figcaption>';
                    details_related[i]["type"] = crop(related_tmp, begin, end, false);
                    // Uzyskanie zależności
                    begin = 'alt="' + details_related[i]["title"] + '" />\n<figcaption class="figure-type">';
                    end = '</figcaption>';
                    details_related[i]["relatability"] = crop(related_tmp, begin, end, false);

                }
            } else {
                details_related = "Brak powiązanych serii.";
            }
            //console.log(details_related );
            //console.log("---------------------------------------------------------------------------------------------------");
            //==================================================================================================================================
            // Oceny

            //console.log("Oceny: ");
            begin = '<h4 class="info-aside-title">Oceny:</h4>';
            end = '</li>\n</ul>\n</section>';
            var rating_main_element = crop(u, begin, end, true); // Ogólny element ocen
            var rating_labels = new Array("Ogolna", "Fabula", "Grafika", "Muzyka", "Postacie"); // Nazwy typów ocen

            for (var i = 0; i < rating_labels.length - 1; i++) // Wpisanie nazw ocen do zmiennej rating
            {
                details_rating[rating_labels[i]] = [null, null];
            }
            // Ogólna
            begin = '<h3 class="info-aside-rating-data"><span class="info-aside-rating-user">';
            end = '</span>/10</h3>';
            details_rating["Ogolna"][0] = parseFloat(crop(rating_main_element, begin, end, false).replace(/,/, "."));
            begin = '</span>/10</h3>\n<span class="h6">';
            end = ' głosów</span>\n</div>\n</div>\n</section>';
            details_rating["Ogolna"][1] = parseFloat(crop(rating_main_element, begin, end, false));

            // Zawężenie do szczegółowych ocen
            begin = '</section>\n<ul class="info-aside-overall-rating">';
            end = '</ul>\n</section>';
            rating_main_element = crop(rating_main_element, begin, end, false);
            if (rating_main_element == "\n") {
                //console.log("Brak ocen.");
                rating_main_element = "Brak ocen.";
            } else {
                // Pętla zapisująca oceny do tablicy z indeksem słownym
                for (var i = 1; i < rating_labels.length - 1; i++) {
                    begin = '<li class="button-with-tip" title="Głosów: ';
                    if (rating_labels[i] == "Fabula")
                        end = ' <span>Fabuła</span></li>'; // Dla nazwy "Fabula", wyszukaj "Fabuła"
                    else
                        end = ' <span>' + rating_labels[i] + '</span></li>';
                    details_rating[rating_labels[i]][0] = parseFloat(crop(rating_main_element, begin, end, false).split('">')[1].replace(/,/, "."));
                    details_rating[rating_labels[i]][1] = parseFloat(crop(rating_main_element, begin, end, false).split('">')[0]);
                    rating_main_element = rating_main_element.replace(/.(?<=<)(.*)(?=>)./, ""); // Usunięcie tagów HTML
                }
                //console.log(details_rating);
            }
            //console.log("---------------------------------------------------------------------------------------------------");
            //==================================================================================================================================
            // Informacje szczegółowe

            //console.log("Informacje szczegółowe: ");
            begin = '<section class="title-small-info">\n<h4 class="info-aside-title">Informacje:</h4>\n<dl class="info-aside-list">';
            end = '</dl> </section>';
            var info_main_element = crop(u, begin, end, false);
            var info_labels = [// Nazwy dla informacji
                "Typ",
                "Status",
                "Data emisji",
                "Koniec emisji",
                "Liczba odcinków",
                "Studio",
                "Długość odcinka",
                "MPAA"
            ];
            // Usunięcie tagów HTML
            info_main_element = removeHTMLTags(info_main_element);

            // Pozbycie się niepotrzebnych danych ( A JEDNAK POTRZEBNYCH )
            for (var i = 0; i <= info_labels.length - 1; i++) {
                var types = info_main_element.match(info_labels[i] + ":\n", "");
                if (types == null)
                    delete info_labels[Object.keys(info_labels)[i]];

            }
            info_labels = info_labels.filter(function (el) {
                return el != null;
            });
            for (var i = 0; i <= info_labels.length - 1; i++)
                info_main_element = info_main_element.replace(info_labels[i] + ":\n", "");
            //console.log(types);
            info_main_element = info_main_element // Pozbycie się niepotrzebnych pustych wyników z tablicy
                .replace(/,\n/g, ", ")
                .replace(/\n\n/g, "\n")
                .replace(/,\s(?!.*,\s)/, "")
                .split("\n")
                .filter(value => Object
                    .keys(value).length !== 0);
            // Zapisanie informacji do tablicy
            for (var i = 0; i < info_labels.length; i++)
                details_info[info_labels[i]] = info_main_element[i];

            //console.log(details_info);
            //console.log("---------------------------------------------------------------------------------------------------");
            //==================================================================================================================================
            // Statystyki
            //console.log("Statystyki tytułu:");
            var stats_labels = [// Nazwy dla statystyk
                "Ogląda",
                "Obejrzało",
                "Pominęło",
                "Wstrzymało",
                "Porzuciło",
                "Planuje",
                "Lubi"
            ];
            begin = '<section class="title-stats">\n<h4 class="info-aside-title">Statystyki tytułu:</h4>';
            end = '</dl>\n</section>';
            var stats_main_element = crop(u, begin, end, false);
            stats_main_element = removeHTMLTags(stats_main_element);
            stats_main_element = stats_main_element
                .replace(/\s/g, "\n")
                .replace(/\n\n/g, "\n")
                .split("\n")
                .filter(value => Object
                    .keys(value).length !== 0);

            for (var i = 0; i < stats_main_element.length; i++) // Oczyszczenie liczb z niepotrzebynch stringów
                if (!isNaN(parseFloat(stats_main_element[i])))
                    stats_main_element[i - 1] = stats_main_element.splice(i, 1)[0];

            for (var i = 0; i < stats_labels.length; i++) // Utworzenie indeksów dla tabeli
                details_stats[stats_labels[i]] = stats_main_element[i];

            //console.log(details_stats);
            //console.log("---------------------------------------------------------------------------------------------------");
            //=================================================================================================================================
            //console.log("Postacie:");
            begin = '<h2 class="box-title h4"><i class="fa fa-fw icon fa-group"></i>Postacie</h2>\n<section class="ch-st-list">';
            end = '</a></div>\n</section>\n\n<section class="box">';
            var chars_main_element = crop(u, begin, end, false);

            // Uzyskanie nazwy postaci
            var names = chars_main_element.match(/(?<=">)(.*)(?=<\/a><\/h3>\n<p>.{3,15}<\/p>)/g);
            if (names != null)
                names.filter(value => Object.keys(value).length !== 0);
            else
                names = 0;
            // Uzyskanie linku postaci
            var links = chars_main_element.match(/(?<=<h3><a href=")(.*)(?=">.{3,20}<\/a><\/h3>\n<p>.{3,15}<\/p>)/g);
            // Uzyskanie typu postaci
            var types = chars_main_element.match(/(?<=<p>)(....*)(?=<\/p>)/g);
            for (var i = 0; i < names.length; i++)
                details_characters[i] = [names[i], types[i], links[i]];
            if (details_characters.length == 0) {
                //console.log("Brak postaci.");
                details_characters = "Brak postaci.";
            } else //console.log(details_characters);
                return {
                    "title": details_title,
                    "description": details_desc,
                    "tags": details_tags,
                    "related": details_related,
                    "rating": details_rating,
                    "info": details_info,
                    "stats": details_stats,
                    "characters": details_characters
                };

        }
        //var full_html = getReq(url, "GET");
        let promise = new Promise(function (resolve, reject) {
            resolve(getReq(url, "GET"));
        });
        let xf;
        promise.then((s) => {
            xf = cb(s[0], s[1])
        }).finally(() => {
            resolve(xf)
        });
    });
    return promise2;
}
function getEpisodes(url, nr, username, password) {
    console.log("\x1b[33mshinden-api\x1b[0m\x1b[37m: Getting episodes for '\x1b[31m" + url + "\x1b[0m\x1b[37m' on '\x1b[31m" + base_url + "\x1b[0m\x1b[37m'...");
    if (debug)
        console.log("\x1b[33mshinden-api\x1b[0m\x1b[37m: Action requires processing JavaScript, passing control to headless browser...");
    url = url + "/all-episodes";
    var user = "";
    var pass = "";
    var logged = true;
    let promise2 = new Promise(function (resolve, reject) {
        var all_eps;
        // Pobiera listę odcinków dotyczące danego anime

        async function cb(u, url) { // Funkcja Callback - Wywoływana przy wykonaniu funkcji asynchronicznej.
            //setTimeout(function () { // Po sekundzie od załadowania strony, wykonaj poniższą funkcję
            if (debug)
                console.log("\x1b[33mshinden-api\x1b[0m\x1b[37m: Regained control, modifying results...");
            if (debug)
                console.log("---------------------------------------------------------------------------------------------------");
            //u = await u.then();
            // Uzyskanie ogólnego elementu
            var begin = '<tbody class="list-episode-checkboxes">';
            var end = '</tbody>';
            if (url == "https://shinden.pl/main/0/login") {
                console.log("\x1b[33mshinden-api\x1b[0m\x1b[37m: [ERROR] Failed to log in!");
                process.exit(-1);

            };
            var root_element = u.match(/(?<=<tbody\sclass="list-episode-checkboxes">).*(?=<\/tbody>)/gs)[0];

            // Uzyskanie poszczególnego elementu
            begin = '<tr>';
            end = '</tr>';
            var single_element = crop(root_element, begin, end, true);

            //root_element = root_element.replace(single_element,"");

            all_eps = crop(single_element, '<tr>\n<td>', '</td>', false); ;
            for (var i = 0; i < all_eps; i++) {
                //episodes_list[i] = episodes_labels;
                episodes_list[i] = {
                    "nr": null,
                    "title": null,
                    "online": null,
                    //"language":null,
                    "date": null,
                    "link": null
                };

                // Uzyskanie numeru odcinka
                try {
                    episodes_list[i]["nr"] = parseFloat(root_element.match(/(?<=<tr>\n<td>).{1,3}(?=<\/td>)/g)[0]);
                } catch {
                    episodes_list[i]["nr"] = "RES_LOAD_ERROR"
                }
                // Uzyskanie tytułu
                try {
                    episodes_list[i]["title"] = (root_element.match(/(?<=<td class="ep-title">).*(?=<\/td>)/g)[0] == '') ? "NO_TITLE" : root_element.match(/(?<=<td class="ep-title">).*(?=<\/td>)/g)[0];
                } catch {
                    episodes_list[i]["title"] = "RES_LOAD_ERROR"
                }
                // Uzyskanie statusu online
                //console.log(i+". "+root_element.match(/(?<=<td><i\sclass="fa\sfa-fw\sfa-).*(?="><\/i>\s)/g)[i]);
                try {
                    episodes_list[i]["online"] = (root_element.match(/(?<=<td><i\sclass="fa\sfa-fw\sfa-).*(?="><\/i>\s)/g)[0] == 'times') ? "No" : "Yes";
                } catch {
                    logged = false;
                    episodes_list[i]["online"] = "RES_LOAD_ERROR"
                }
                // Uzyskanie daty
                episodes_list[i]["date"] = (root_element.match(/(?<=<td\sclass="ep-date">).*(?=<\/td>)/g)[0] == '') ? "NO_DATE" : root_element.match(/(?<=<td\sclass="ep-date">).*(?=<\/td>)/g)[0];

                // Uzyskanie linku
                try {
                    episodes_list[i]["link"] = (root_element.match(/(?<=<a\shref=").*(?="\sclass="button\sactive">)/g)[0] == '') ? "NO_LINK" : base_url.replace(/pl\//, "pl") + root_element.match(/(?<=<a\shref=").*(?="\sclass="button\sactive">)/g)[0];
                } catch {
                    logged = false;
                    episodes_list[i]["link"] = "RES_LOAD_ERROR"
                }

                begin = '<tr>';
                end = '</tr>';
                single_element = crop(root_element, begin, end, true);
                root_element = root_element.replace(single_element, "");
            }
            if (nr > 0 && nr <= all_eps)
                return episodes_list[all_eps - nr];
            return (episodes_list);
            //console.log(episodes_list);
            //},1000)
        };
        if (password) {
            user = username;
            pass = password;

        }
        let promise = new Promise(function (resolve, reject) {
            if (user != "" && password != "") {
                if (debug)
                    console.log("\x1b[33mshinden-api\x1b[0m\x1b[37m: Passing login credentials to headless browser...");
                console.log("\x1b[33mshinden-api\x1b[0m\x1b[37m: Logging as " + user + "...");
                resolve(
                    getReqi(url, (user, pass) => {
                        $(".cb-enable").click();
                        $(".login_form_open")[0].click();
                        $($("#login_form label input")[0]).val(user);
                        $($("#login_form label input")[1]).val(pass);
                        $("#login_form button").click();
                        return "f";
                    }, () => {
                        return document.body.innerHTML
                    }, user, pass))
            } else {
                if (debug)
                    console.log("\x1b[33mshinden-api\x1b[0m\x1b[37m: Retrieving data without logging in...");
                resolve(
                    getReqi(url, () => {}, () => {
                        return document.body.innerHTML
                    }))
            }
        }); // Zwraca HTML-a
        let xf; // Wynik callback-a
        promise.then((s) => {
            try {
                xf = cb(s[0], s[1])
            } catch (e) {
                console.error("\x1b[33mshinden-api\x1b[0m\x1b[37m: [ERROR] HTML request failed...");
                process.exit(-1);
            }
        }).finally(() => {
            resolve(xf);
            if (logged == false)
                console.log("\x1b[33mshinden-api: [WARN] Failed to load some resources because user is not logged in. Try launching with credentials.\x1b[0m\x1b[37m")
        });
    });
    return promise2;
}
async function getPlayerList(url) {
    console.log("\x1b[33mshinden-api\x1b[0m\x1b[37m: Getting episodes for '\x1b[31m" + url + "\x1b[0m\x1b[37m' on '\x1b[31m" + base_url + "\x1b[0m\x1b[37m'...");
    if(debug) console.log("\x1b[33mshinden-api\x1b[0m\x1b[37m: Action requires processing JavaScript, passing control to headless browser...");
    //url=url+"/all-episodes";
    let promise2 = new Promise(function (resolve, reject) {
        var all_eps;
        // Pobiera listę odcinków dotyczące danego anime

        async function cb(u, url) { // Funkcja Callback - Wywoływana przy wykonaniu funkcji asynchronicznej.
            //setTimeout(function () { // Po sekundzie od załadowania strony, wykonaj poniższą funkcję
            if (debug) console.log("\x1b[33mshinden-api\x1b[0m\x1b[37m: Regained control, modifying results...");
            console.log("---------------------------------------------------------------------------------------------------");
            u = u.match(/(?<="mobile-hidden">).*(<\/table>\n<\/div>\n<\/section>\n)/gs)[0];
            var plr_cnt = u.match(/(?<=<td\sclass="ep-pl-name">).*(?=<\/td>)/g).length;

            for (var i = 0; i < plr_cnt; i++) {
                player_list[i] = {
                    "player": null,
                    "quality": null,
                    "voice_lang": null,
                    "sub_lang": null,
                    "added_date": null,
                    "player_id": null
                };
                player_list[i]["player"] = u.match(/(?<=<td\sclass="ep-pl-name">).*(?=<\/td>)/g)[i];
                player_list[i]["quality"] = u.match(/(?<=title=".{3,10}"><\/span>).*(?=<\/td>)/g)[i];
                player_list[i]["voice_lang"] = u.match(/(<td\sclass="ep-pl-alang">.*<\/span>\n.*)/g)[i].replace(/(<([^>]+)>)/gi, "").replace("&nbsp;", "").replace("\n", "").replace(" ", "");
                player_list[i]["sub_lang"] = u.match(/(<td\sclass="ep-pl-slang">.*<\/span>\n.*)/g)[i].replace(/(<([^>]+)>)/gi, "").replace("&nbsp;", "").replace("\n", "").replace(" ", "").replace("--", "BRAK");
                player_list[i]["added_date"] = u.match(/(?<=<td\sclass="ep-online-added">).*(?=<\/td>)/g)[i];
                player_list[i]["player_id"] = u.match(/(?<=id="player_data_).*(?=" data)/g)[i];

            }

            return player_list;
        };

        let promise = new Promise(function (resolve, reject) {
            resolve(getReqi(url, () => {
                    return document.body.innerHTML
                }))
        });
        let xf;
        promise.then((s) => {
            xf = cb(s[0], s[1])
        }).finally(() => {
            resolve(xf)
        });
    });

    return promise2;
}
function altVideo(url) {
    let promise2 = new Promise(function (resolve, reject) {
        async function cb(u, url) {
            return u;
        }
        let promise = new Promise(function (resolve, reject) {
            resolve(getReq(url, "GET"));
        });
        let xf;
        promise.then((s) => {
            xf = cb(s[0], s[1])
        }).finally(() => {
            resolve(xf)
        });
    });
    return promise2;
}
function getVideoLink(button_id, auth_key) {
    return null;

    var url = "https://api4.shinden.pl/xhr/" + button_id + "/player_load?auth=" + auth_key;
    if (debug)
        console.log("\x1b[0m\x1b[37m\x1b[1mLocating player at '\x1b[31m" + url + "\x1b[0m\x1b[37m' on '\x1b[31m" + base_url + "\x1b[0m\x1b[37m'...");
    let promise2 = new Promise(function (resolve, reject) {
        async function cb(u, url) {
            //u=await u.then();
            if (u == "5")
                url = url.replace("load", "show");
            setTimeout(async function () {
                altVideo(url).then((s) => {
                    console.log(s)
                })
            }, 5500)

            return null;
        }
        let promise = new Promise(function (resolve, reject) {
            resolve(getReq(url, "GET"));
        });
        let xf;
        promise.then((s) => {
            xf = cb(s[0], s[1])
        }).finally(() => {
            resolve(xf)
        });
    });
    return promise2;
}
function getComments(url) {
    if (debug)
        console.log("\x1b[0m\x1b[37m\x1b[1mGetting comments for '\x1b[31m" + url + "\x1b[0m\x1b[37m' on '\x1b[31m" + base_url + "\x1b[0m\x1b[37m'...");
    let promise2 = new Promise(function (resolve, reject) {
        function cb(u, url) {
            if (debug)
                console.log("\x1b[33mshinden-api\x1b[0m\x1b[37m: Scraping page \x1b[31m" + url + "\x1b[0m\x1b[37m");
            if (debug)
                console.log("\x1b[33mshinden-api\x1b[0m\x1b[37m: SCRAPING COMPLETE! \n---------------------------------------------------------------------------------------------------");
            var begin = '<ul class="posts">';
            var end = '</li>\n</ul>';
            var posts_element = crop(u, begin, end, false);
            var user_type = posts_element.match(/(?<=">).*(?=<\/span>\n<\/a)/g);
            var nick = posts_element.match(/(?<=<strong>).*(?=<\/strong>)/g);
            var tag = posts_element.match(/(?<="thread">).*(?=<\/a>)/g);
            var date = posts_element.match(/(?<=:..">).*(?=<\/span>)/g);
            var comment = posts_element.match(/(?<=reply">\n).*(?=<\/div>)/g);
            //console.log(posts_element);

            for (var i = 0; i < 10; i++) {
                comment_list[i] = {
                    "user": null,
                    "nick": null,
                    "tag": null,
                    "date": null,
                    "comment": null
                };
                comment_list[i]["user"] = user_type[i];
                comment_list[i]["nick"] = nick[i];
                comment_list[i]["tag"] = tag[i];
                comment_list[i]["date"] = date[i];
                comment_list[i]["comment"] = comment[i];
            }

            return comment_list;
        }
        let promise = new Promise(function (resolve, reject) {
            resolve(getReq(url, "GET"));
        });
        let xf;
        promise.then((s) => {
            xf = cb(s[0], s[1])
        }).finally(() => {
            resolve(xf)
        });
    });
    return promise2;
    // var full_html = getReq(url, "GET", cb);
}
function cleanup() {
    delete anime_search_list;
    delete details_desc;
    delete details_tags;
    delete details_related;
    delete details_rating;
    delete details_info;
    delete details_stats;
    delete details_characters;
}
function crop(full, begin, end, keep_begin_end) { // Przycinanie stringa
    try {
        if (keep_begin_end == true) {
            cropped = begin + full.split(begin)[1]; // Początek wyniku
            cropped = cropped.split(end)[0] + end; // Koniec wyniku
        } else {
            cropped = full.split(begin)[1]; // Początek wyniku
            cropped = cropped.split(end)[0]; // Koniec wyniku
        }
        return cropped; // Zwrot
    } catch (err) {
        //console.error(err);
        return "NO INFO!";
    }
}
async function getReq(url, method) { // Pobieranie kodu HTML strony
    let promise = new Promise(function (res, rej) {
        var req = new XMLHttpRequest(); // Inicjalizacja obiektu
        req.open(method, url, true); // Otwarcie połączenia
        req.setDisableHeaderCheck(true); // Ignorowanie 'niebezpiecznych' nagłówków
        req.setRequestHeader("cookie", "cb-rodo=accepted", "user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36 OPR/73.0.3856.424", "accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9", "accept-encoding", "gzip, deflate, br", "accept-language", " pl-PL,pl;q=0.9,en-US;q=0.8,en;q=0.7"); // Własny nagłówek
        //var debug = true;
        var firstcall = true;
        req.onreadystatechange = async function () { // Przy zmianie stanu połączenia - wykonaj
            //if (req.readyState == 4) { // Jeśli status = 4 (strona gotowa)
            //
            //}
            switch (req.readyState) {
            case 0: {
                    if (debug)
                        console.log("\x1b[33mXHttpRequest\x1b[0m\x1b[37m: Client created!");
                    break;
                }
            case 1: {
                    if (debug)
                        console.log("\x1b[33mXHttpRequest\x1b[0m\x1b[37m: [0%] Opened connection!");
                    break;
                }
            case 2: {
                    if (debug)
                        console.log("\x1b[33mXHttpRequest\x1b[0m\x1b[37m: [25%] Received headers!");
                    if (debug)
                        console.log("\x1b[33mXHttpRequest\x1b[0m\x1b[37m: [50%] Loading data...");
                    break;
                }
            case 3: {
                    if (debug) {
                        if (firstcall) {
                            process.stdout.write("[");
                            firstcall = false;
                        }
                        process.stdout.write(".");
                    }
                    break;
                }
            case 4: {
                    if (debug)
                        console.log("]");
                    if (req.status == 200) // Oraz numer odpowiedzi http = 200 (poprawne połaczenie)
                    {
                        if (debug)
                            console.log("\x1b[33mXHttpRequest\x1b[0m\x1b[37m: [100%] Data loaded!");

                        res([req.responseText, url]); // Odnieś się do callback z kodem html jako argument
                    } else
                        throw "Can't load page. Error code: " + req.status;
                    break;
                }
            }
        };
        req.send(); // Wyślij zapytanie
    });
    return promise.then((f) => {
        return f
    });

}
function addStr(str, index, stringToAdd) {
    return str.substring(0, index) + stringToAdd + str.substring(index + 1, str.length);
}
function removeHTMLTags(input) {
    return input.replace(/(<([^>]+)>)/gi, "");
}
async function getReqi(url, before_script, after_script, first, second) {
    if (debug)
        console.log("\x1b[36mpuppeteer\x1b[0m\x1b[37m: [1/6] Received control, launching browser at '\x1b[31m" + url + "\x1b[0m'...\x1b[37m");
    if (debug)
        if (first && second)
            console.log("\x1b[36mpuppeteer\x1b[0m\x1b[37m: \x1b[33mINFO: Received additional data, injecting into script parameters...\x1b[0m\x1b[37m");
    const browser = await pt.launch({
       headless: true
    });
    try {
        
        if (debug)
            console.log("\x1b[36mpuppeteer\x1b[0m\x1b[37m: [2/6] Launched browser, opening tab\x1b[37m");
        const page = await browser.newPage();
		await page.setRequestInterception(true);
        if (debug)
            console.log("\x1b[36mpuppeteer\x1b[0m\x1b[37m: [3/6] Opened new page tab, applying headers\x1b[37m");
        await page.setExtraHTTPHeaders({
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.36',
            'cookies': 'cb-rodo=accepted',
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
            'accept-encoding': 'gzip, deflate, br'
        })
        if (debug)
            console.log("\x1b[36mpuppeteer\x1b[0m\x1b[37m: [4/6] Applied headers, opening '\x1b[31m" + url + "\x1b[0m'...\x1b[37m");
        page.on('request', (req) => {
            if (/*req.resourceType() == 'stylesheet' || req.resourceType() == 'image' ||*/ req.resourceType() == 'font') {
                req.abort();
            } else {
                req.continue();
            }
        });

        await page.goto(url);

        if (debug)
            console.log("\x1b[36mpuppeteer\x1b[0m\x1b[37m: [5/6] Opened '\x1b[31m" + url + "\x1b[0m', injecting script...\x1b[37m");

        if (first && second)
            var f = await page.evaluate(before_script, first, second);
        else
            var f = await page.evaluate(before_script);

        //page.click("#login_form button");
        if (debug)
            console.log("\x1b[36mpuppeteer\x1b[0m\x1b[37m: [6/6] Done. Closing browser and passing control back...\x1b[37m");
        if (after_script && first && second)
            await page.waitForNavigation();
        if(after_script)var res = await page.evaluate(after_script);
        await page.screenshot({
            path: 'screenshot.png'
        });
        browser.close();
        if(after_script) return [res, page.url()];
        else return [f, page.url()];
    } catch (e) {
        //console.log("\x1b[36mpuppeteer\x1b[0m\x1b[37m: Error occured. Closing browser, passing back control...");
        browser.close();
        console.error("\x1b[36mpuppeteer\x1b[0m\x1b[37m: [ERROR] \x1b[31m" + e + "\x1b[0m");
        process.exit(-1)
    }
}
// Moduły
module.exports.getAnimeList = getAnimeList;
module.exports.getAnimeList = getAnimeList;
module.exports.getDetails = getDetails;
module.exports.getEpisodes = getEpisodes;
module.exports.getPlayerList = getPlayerList;
module.exports.getVideoLink = getVideoLink;
module.exports.getComments = getComments;
