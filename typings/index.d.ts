/// <reference path="./ts-utility-types.d.ts" />

/*------------------------------------ MAKE REQUIRE AVAILABLE ------------------------------------*/
/**
 * Make require calls globally available
 */
declare var require: {
    <T = any>(path: string): T;
    (paths: string[], callback: (...modules: any[]) => void): void;
    ensure: (paths: string[], callback: (require: <T>(path: string) => T) => void) => void;
};
