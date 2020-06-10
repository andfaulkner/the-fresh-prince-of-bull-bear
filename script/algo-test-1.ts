/*------------------------------------- THIRD-PARTY MODULES --------------------------------------*/
import path from 'path';
import {writeFileSync} from 'fs';
import {path as rootPath} from 'app-root-path';

import {redeemToken} from 'questrade-ts';

/*--------------------------------------- TYPE DEFINITIONS ---------------------------------------*/
type ThenArg<T> = T extends PromiseLike<infer U> ? U : T;

type QuestradeApi = ThenArg<ReturnType<typeof redeemToken>>['qtApi'];

/*-------------------------------------------- CONFIG --------------------------------------------*/
// TODO get from env vars
// e.g. "G5pYM3IB7oYBaGuY_vttXA5fd8Auh0P40"
const token = 'DUMMY_TOKEN';

const numStocks = 100;

let qtApi: QuestradeApi;

/*------------------------------------------- HELPERS --------------------------------------------*/
/**
 * Return full list of stocks from NASDAQ (WARNING: long-running)
 */
const getNASDAQStocks = async (offset: number) => await qtApi.search.allStocks('NASDAQ', offset);

const getAllMarkets = () => {
    const allMarkets = await qtApi.market.getAllMarkets();
    console.log(`allMarkets:`, allMarkets);
    return allMarkets;
};


/*----------------------------------------- MAIN SCRIPT ------------------------------------------*/
/**
 * Main application code - talk to Questrade, get data (TEMP)
 */
const main = async () => {
    // Return and globally store QT API connection
    const qt = await redeemToken(token);
    qtApi = qt.qtApi;
    console.log(`qtApi:`, qtApi);

    const allMarkets = getAllMarkets();

    // Grab stocks list, but limit the number returned

    let allStocks = [];

    let counter = 0;
    let currentStocks = await getNASDAQStocks(counter);

    while (currentStocks.length > 0 && counter <= numStocks) {
        console.log(currentStocks);
        allStocks = allStocks.concat(currentStocks);
        counter += 20;
        currentStocks = await getNASDAQStocks(counter);
    }

    // Write all returned stocks into a data file
    writeFileSync(path.join(rootPath, 'data/all-stocks.json'), JSON.stringify(allStocks));

    // Print all returned stocks to console
    console.log(`\n\n\n`);
    console.log(`allStocks:`, allStocks);
};

/*--------------------------------------------- RUN ----------------------------------------------*/
// Run script
main();
