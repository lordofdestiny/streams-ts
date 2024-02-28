/**
 * @packageDocumentation
 *  Main module for the library. This module re-exports all the public members of the library.
 *
 **/

export {Stream} from '~/stream';
/** @namespace
 * Types used by the library interfaces
 * */
export * as types from "~/types";
/** @namespace
 * Error classes that are thrown by the library
 * */
export * as errors from "~/errors";

/** @namespace
 * @internal
 * Utility functions for transforming and combining iterables
 *
 * You are not supposed to use these functions directly.
 *Instead, use the methods of the `Stream` class.
 * */
export * as generators from "~/generators";