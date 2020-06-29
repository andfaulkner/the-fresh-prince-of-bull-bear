/// <reference path="../../typings/index.d.ts" />
/// <reference path="./typings/vendor.d.ts" />

/*------------------------------------- THIRD-PARTY MODULES --------------------------------------*/
import path from 'path';
import {writeFileSync} from 'fs';
// Reference to root path of project
import {path as rootPath} from 'app-root-path';
import {redeemToken} from 'questrade-ts';

/*------------------------------------------- LOGGING --------------------------------------------*/
import {logFactory, Styles} from 'mad-logs/lib/shared';
const log = logFactory(__filename.replace(`${__dirname}/`, ``), Styles.cantTouch);

/*-------------------------------------------- CONFIG --------------------------------------------*/
import {config as envConfig} from 'dotenv';
envConfig({path: path.join(rootPath, `./config/env/.env`)});

/**
 * Allows access to the Questrade API
 * Note: must be updated in .env file every few days.
 *
 * e.g. "G5pYM3IB7oYBaGuY_vttXA5fd8Auh0P40"
 */
const questradeApiToken = process.env['QUESTRADE_API_TOKEN'];

/*--------------------------------------- TYPE DEFINITIONS ---------------------------------------*/
type QuestradeApi = UnpackPromise<ReturnType<typeof redeemToken>>['qtApi'];

type AllStocks = UnpackPromise<ReturnType<QuestradeApi['search']['allStocks']>>;

/*-------------------------------------------- CONFIG --------------------------------------------*/
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
    log.info(``);
    // Return and globally store QT API connection
    const qt = await redeemToken(questradeApiToken).catch(err => {
        log.error(`[ERROR] Redeem API token failed:`, err);
        throw err;
    });

    qtApi = qt.qtApi;
    console.log(`qtApi:`, qtApi);

    const allMarkets = await getAllMarkets();

    // Grab NASDAQ stocks list, but limit the number returned
    const nasdaqStocks = await getAllNASDAQStocks();

    // Write all returned stocks into a data file
    writeFileSync(path.join(rootPath, 'data/nasdaq-stocks.json'), JSON.stringify(nasdaqStocks));

    // Print all returned stocks to console
    console.log(`\n\n\n`);
    console.log(`nasdaqStocks:`, nasdaqStocks);
};

/*--------------------------------------------- RUN ----------------------------------------------*/
// Run script
main();
