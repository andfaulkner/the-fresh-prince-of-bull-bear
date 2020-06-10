import { redeemToken } from "questrade-ts";
import { writeFileSync } from "fs";
import path from "path";

import { path as rootPath } from "app-root-path";

type ThenArg<T> = T extends PromiseLike<infer U> ? U : T;

type QuestradeApi = ThenArg<ReturnType<typeof redeemToken>>["qtApi"];

let qtApi: QuestradeApi;

const getAllStocks = async (offset: number) => {
    return await qtApi.search.allStocks("", offset);
};

const main = async () => {
    const qt = await redeemToken("G5pYM3IB7oYBaGuY_vttXA5fd8Auh0P40");

    qtApi = qt.qtApi;

    console.log(`qtApi:`, qtApi);
    const allMarkets = await qtApi.market.getAllMarkets();
    console.log(`allMarkets:`, allMarkets);

    let allStocks = [];

    let counter = 0;
    let currentStocks = await getAllStocks(counter);

    while (currentStocks.length > 0 && counter <= 100) {
        console.log(currentStocks);
        allStocks = allStocks.concat(currentStocks);
        counter += 20;
        currentStocks = await getAllStocks(counter);
    }

    writeFileSync(path.join(rootPath, "data/all-stocks.json"), JSON.stringify(allStocks));

    console.log(`\n\n\n`);
    console.log(`allStocks:`, allStocks);
};

main();

/**
 * Login to account
 */

// qt.t
