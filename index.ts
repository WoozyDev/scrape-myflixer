import axios, { AxiosResponse } from "axios";
import { writeFileSync } from 'fs';
import { Element, load } from 'cheerio';

type Movie = {
    quality: string,
    image: string,
    url: string,
    name: string,
    year: number,
    duration: string,
    type: string
}

let getMovies_Unscraped = async (page?: number) => {
    return await axios.get(`https://myflixerz.to/movie${page ? `?page=${page}` : ''}`);
}

let getMovies_Scraped = async (unscraped_data: AxiosResponse<any, any>): Promise<Movie[]> => {

    return new Promise((resolve, reject) => {
        let $ = load(unscraped_data.data);

        const flwItems = $('.flw-item');

        var movies = [...flwItems].map(a => {
            
            let poster = (a.children[1] as Element);
            let quality = (((poster.children[1]! as Element).children[0] as any) as Text).data;
            let imgURL = ((poster.children[3]! as Element) as Element).attribs['data-src'];
            let movieURL = 'https://myflixerz.to' + ((poster.children[5]! as Element) as Element).attribs['href'];

            let details = (a.children[3] as Element);
            let filmName = (((((details.children[1] as Element).children[0] as any) as Element).children[0] as any) as Text).data;

            let info = (details.children[3] as Element);
            let year = ((((info.children[1] as any) as Element).children[0] as any) as Text).data;
            let duration = ((((info.children[5] as any) as Element).children[0] as any) as Text).data;
            let type = ((((info.children[7] as any) as Element).children[0] as any) as Text).data;
            
            (String.prototype as any).minsToHHMMSS = function () {
                var mins_num = parseInt(this, 10); // don't forget the second param
                var hours   = Math.floor(mins_num / 60) as any;
                var minutes = Math.floor((mins_num - ((hours * 3600)) / 60)) as any;
                var seconds = Math.floor((mins_num * 60) - (hours * 3600) - (minutes * 60)) as any;
            
                // Appends 0 when unit is less than 10
                if (hours   < 10) {hours   = "0"+hours;}
                if (minutes < 10) {minutes = "0"+minutes;}
                if (seconds < 10) {seconds = "0"+seconds;}
                return hours+':'+minutes+':'+seconds;
            }

            return {
                quality,
                image: imgURL,
                url: movieURL,
                name: filmName,
                year: year != 'N/A' ? parseInt(year) : 'N/A',
                duration: (duration as any).minsToHHMMSS(),
                type
            } as Movie;

        })

        resolve(movies);
    })

}

(async () => {
    let movies = await getMovies_Scraped(await getMovies_Unscraped(2));
    console.log(movies);
})();