import config from "../config/config.js";

const api = config.api;

export const convertCurrency = async ({date,amount,source,target}) => {
    const url = `https://api.freecurrencyapi.com/v1/latest?apikey=${api}&currencies=${target}&base_currency=${source}`;
    try {
        const response = await fetch(url);
        const json = await response.json();
        return amount * json.data[target].toFixed(2);
    } catch (error) {
        return error;
    }
}

export const currencyList = async () => {
    const url = `https://api.freecurrencyapi.com/v1/currencies?apikey=${api}`;
    try {
        const response = await fetch(url);
        const json = await response.json();
        return json.data;
    } catch (error) {
        return error;
    }

}