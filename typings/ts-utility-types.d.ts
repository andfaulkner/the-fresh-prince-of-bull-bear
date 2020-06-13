/*---------------------------------------- UTILITY TYPES -----------------------------------------*/
/**
 * Extract return type of promise-wrapped function - i.e. the types of the
 * arguments in the then function.
 *
 * e.g. For promise-returning function allStocks:
 *         qtApi.search.allStocks.then((res: ISymbolSearchResult[]) => ...)
 *     ...UnpackPromise gets the value of the argument in the function given to "then" using:
 *         UnpackPromise<ReturnType<QuestradeApi['search']['allStocks']>>
 *     ...which returns:
 *         ISymbolSearchResult[]
 *
 * e.g. UnpackPromise<ReturnType<typeof redeemToken>>['qtApi'];
 */
declare type UnpackPromise<T> = T extends PromiseLike<infer U> ? U : T;

/**
 * Get all keys of a given object
 *
 * Example:
 *     const testObj = {a: 1, b: 2};
 *
 *     type TestObjType = Keys<typeof testObj>; // => 'a' | 'b'
 */
declare type Keys<O> = keyof O;

/**
 * Get all values of a given object
 *
 * Example:
 *     const testObj = {
 *         a: 1,
 *         b: 'bee',
 *         fn: () => 'out',
 *         objProp: {d: 'dee', e: 3}
 *     };
 *
 *     type TestObjValues = Values<typeof testObj>;
 *     // => string | number | (() => string) | {d: string, e: number}
 */
declare type Values<O> = O[keyof O];

/*---------------------------------- MERGE/COMPARE OBJECT TYPES ----------------------------------*/
/**
 * Works identically to Object.assign (for types)
 *
 * Assign values to 1st given object type (A) from 2nd given object type (B)
 * Values from 2nd given object are taken in the even of an overlap
 *
 * Example:
 *     type ObjA = {a: string, b: number, c: 2            };
 *     type ObjB = {           b: 'bee',  c: 'aa', d: 'ok'};
 *
 *     type NewObj = Assign<ObjA, ObjB>; // => {a: string, b: 'bee', c: 'aa', d: 'ok'}
 */
declare type Assign<
    A extends object,
    B extends object,
    ReturnObj = ObjDiff<A, B> & ObjIntersection<B, A> & ObjDiff<B, A>
> = Pick<ReturnObj, keyof ReturnObj>;
