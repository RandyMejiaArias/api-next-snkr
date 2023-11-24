import axios from 'axios';
import { ScrapeConfig, ScrapflyClient } from "scrapfly-sdk";
import config from '../config.js';

const goatApi = axios.create({
  baseURL: 'https://ac.cnstrc.com/search'
});

const goatScrapfly = new ScrapflyClient({
  key: config.SCRAPFLY_KEY
});

const searchOnGoat = async (query) => {
  try {
    const { data } = await goatApi.get(
      `/${query}?c=ciojs-client-2.35.2&key=key_XT7bjdbvjgECO5d8&page=1&num_results_per_page=24&sort_by=relevance&sort_order=descending`
    );
    const { response: results } = data;
    return results;
  } catch (error) {
    console.log(error);
    return error;
  }
}

const getGoatPrices = async (goatId) => {
  try {
    const { result } = await goatScrapfly.scrape(new ScrapeConfig({
      url: `https://www.goat.com/web-api/v1/product_variants/buy_bar_data?productTemplateId=${goatId}&countryCode=EC`,
      asp: true,  // enable scraper blocking bypass
      render_js: false,  // enable headless web browser
    }))

    return JSON.parse(result.content);
  } catch (error) {
    console.log(error);
    return error;
  }
}

export { getGoatPrices, searchOnGoat };