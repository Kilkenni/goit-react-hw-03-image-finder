export default class PixabayFetch {
    apiUrl = "https://pixabay.com/api/?";
    params = {
        page: 1,
        per_page: 12,
        image_type: "photo",
        orientation: "horizontal",
        safesearch: true,
        q: "",
    };
    key = "24889983-c5e39d0275da98cda54faa42b"; //API Key. TODO: move to env

    #fetchController = new AbortController();

    sanitizeString(dirtyString) {
        return dirtyString.trim().replaceAll(/ +/g, '+');
        //some RegExp magic. While it's a homemade one, it should trim spaces at the ends and replace inner spaces with a '+'
        //RegEx *should* do this: search one or more [space] (note the 'Kleene plus') and replace. 
    }

    constructor(searchString = "", safesearch = true) {
        this.params.q = this.sanitizeString(searchString);
        this.params.safesearch = safesearch;
    }

    setSearch(searchString = "") {
        this.params.q = this.sanitizeString(searchString);
    }

    composeQuery() {
        const paramString = Object.keys(this.params).reduce((param_string, key) => {
            return param_string + '&' + key + '=' + this.params[key];
        }, "");

        return this.apiUrl + "key=" + this.key + paramString;
    }

    async fetchImages(page = 1) {
        this.params.page = page;
        const fetchURL = this.composeQuery();
        // return fetchURL;

        const signal = this.#fetchController.signal;

        try {
            const imageData = await fetch(fetchURL, {signal});
            return imageData.json(); 
        }
        catch (error) {
            console.log(error);
        }      
    }

    abortFetch() {
        this.#fetchController.abort();
    }
}