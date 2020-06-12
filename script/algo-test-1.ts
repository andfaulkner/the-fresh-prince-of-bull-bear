/// <reference path="../typings/index.d.ts" />

/*------------------------------------- THIRD-PARTY MODULES --------------------------------------*/
import path from 'path';
import {writeFileSync} from 'fs';
// Reference to root path of project
import {path as rootPath} from 'app-root-path';
import {redeemToken} from 'questrade-ts';

/*-------------------------------------------- CONFIG --------------------------------------------*/
import {config as envConfig} from 'dotenv';
envConfig({path: path.join(rootPath, `./config/env/.env`)});

/*--------------------------------------- TYPE DEFINITIONS ---------------------------------------*/
type QuestradeApi = UnpackPromise<ReturnType<typeof redeemToken>>['qtApi'];

type AllStocks = UnpackPromise<ReturnType<QuestradeApi['search']['allStocks']>>;

/*-------------------------------------------- CONFIG --------------------------------------------*/
// TODO get from env vars
// e.g. "G5pYM3IB7oYBaGuY_vttXA5fd8Auh0P40"
const token = 'DUMMY_TOKEN';

const numStocks = 100;

let qtApi: QuestradeApi;

/*------------------------------------------- HELPERS --------------------------------------------*/
/**
 * Return stocks from NASDAQ
 */
const getNASDAQStocks = async (offset: number) => await qtApi.search.allStocks('NASDAQ', offset);

/**
 * Get full list of stocks in NASDAQ.
 *
 * WARNING: long-running
 */
const getAllNASDAQStocks = async () => {
    let nasdaqStocks: AllStocks = [];

    let counter = 0;
    let currentStocks = await getNASDAQStocks(counter);

    while (currentStocks.length > 0 && counter <= numStocks) {
        console.log(currentStocks);
        nasdaqStocks = nasdaqStocks.concat(currentStocks);
        counter += 20;
        currentStocks = await getNASDAQStocks(counter);
    }

    return nasdaqStocks;
};

/**
 * Return full list of markets
 */
const getAllMarkets = async () => {
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

    // Grab NASDAQ stocks list, but limit the number returned
    const nasdaqStocks = getAllNASDAQStocks();

    // Write all returned stocks into a data file
    writeFileSync(path.join(rootPath, 'data/nasdaq-stocks.json'), JSON.stringify(nasdaqStocks));

    // Print all returned stocks to console
    console.log(`\n\n\n`);
    console.log(`nasdaqStocks:`, nasdaqStocks);
};

/*--------------------------------------------- RUN ----------------------------------------------*/
// Run script
main();
