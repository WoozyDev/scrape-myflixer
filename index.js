const axios_1 = require("axios");
const cheerio_1 = require("cheerio");

let getMovies_Unscraped = async (page) => {
    return await axios_1.default.get(`https://myflixerz.to/movie${page ? `?page=${page}` : ''}`);
};

let getMovies_Scraped = async (unscraped_data) => {
    return new Promise((resolve, reject) => {
        let $ = (0, cheerio_1.load)(unscraped_data.data);
        const flwItems = $('.flw-item');
        var movies = [...flwItems].map(a => {
            let poster = a.children[1];
            let quality = poster.children[1].children[0].data;
            let imgURL = poster.children[3].attribs['data-src'];
            let movieURL = 'https://myflixerz.to' + poster.children[5].attribs['href'];
            let details = a.children[3];
            let filmName = details.children[1].children[0].children[0].data;
            let info = details.children[3];
            let year = info.children[1].children[0].data;
            let duration = info.children[5].children[0].data;
            let type = info.children[7].children[0].data;
            String.prototype.minsToHHMMSS = function () {
                var mins_num = parseInt(this, 10); // don't forget the second param
                var hours = Math.floor(mins_num / 60);
                var minutes = Math.floor((mins_num - ((hours * 3600)) / 60));
                var seconds = Math.floor((mins_num * 60) - (hours * 3600) - (minutes * 60));
                // Appends 0 when unit is less than 10
                if (hours < 10) {
                    hours = "0" + hours;
                }
                if (minutes < 10) {
                    minutes = "0" + minutes;
                }
                if (seconds < 10) {
                    seconds = "0" + seconds;
                }
                return hours + ':' + minutes + ':' + seconds;
            };
            return {
                quality,
                image: imgURL,
                url: movieURL,
                name: filmName,
                year: year != 'N/A' ? parseInt(year) : 'N/A',
                duration: duration.minsToHHMMSS(),
                type
            };
        });
        resolve(movies);
    });
};

let movies = await getMovies_Scraped(await getMovies_Unscraped(2));
console.log(movies);
