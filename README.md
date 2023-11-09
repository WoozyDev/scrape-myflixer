# Scrape MyFlixer movies

### this code scrapes the website to get an amount of movies (name, year, quality, image url, ...)

```ts
// page: the page you want to get data of
// result: an AxiosResponse<any, any>
getMovies_Unscraped(page: number)

// data: response of getMovies_Unscraped
// result: an array of movies 
//          (movie attributes: quality, image, url, name, year, duration, type)
getMovies_Scraped(data: string)
```

```ts
type Movie = {
    quality: string,
    image: string,
    url: string,
    name: string,
    year: number,
    duration: string,
    type: string
}
```

- Coded by @woozy666"# scrape-myflixer" 
