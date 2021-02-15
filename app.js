const axios = require('axios');
const apiKey = 'c4e1e39fde219aee1f37b6c2a776f9e1';
const fixerApi = `http://data.fixer.io/api/latest?access_key=${apiKey}`;

// countries api
const restCountriesApi = `https://restcountries.eu/rest/v2/currency`;

//fetch data of currencties
const getExchangeRate = async (fromCurrency, toCurrency) => {
    try {
        const { data: { rates } } = await axios.get(fixerApi);

        const euro = 1 / rates[fromCurrency];
        const exchangeRate = euro * rates[toCurrency];
        return exchangeRate;
    } catch (error) {
        throw new Error(`Unable to get currency ${fromCurrency} and ${toCurrency}`);
    }

}

//fetch data of countries
const getCountries = async (currencyCode) => {
    try {
        const { data } = await axios.get(`${restCountriesApi}/${currencyCode}`);
        return data.map(({ name }) => name);
    } catch (error) {
        throw new Error(`Unable to get countries that use ${currencyCode}`);
    }
}

const convertCurrency = async (fromCurrency, toCurrency, amount) => {
    fromCurrency = fromCurrency.toUpperCase();
    toCurrency = toCurrency.toUpperCase();

    const [exchangeRate, countries] = await Promise.all([
        getExchangeRate(fromCurrency, toCurrency),
        getCountries(toCurrency),
    ]);

    const convertedAmount = (amount * exchangeRate).toFixed(2);

    return `${amount} ${fromCurrency} is almost ${convertedAmount} ${toCurrency}.
    You can spend these in following countries: ${countries}.`
}


//showing result
convertCurrency('USD', 'BDT', 20)
    .then((result) => console.log(result))
    .catch((error) => console.log(error));



