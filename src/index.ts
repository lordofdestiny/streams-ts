/**
 * @packageDocumentation
 *  Main module for the library. This module re-exports all the public members of the library's
 * latest api version, and api version modules.
 *
 **/

export * as v1 from '~/v1';

export { Stream } from '~/v1/stream';

/**
 * @hidden 
 * @namespace
 * Types used by the library interfaces
 * */
export * as types from '~/v1/types';

/**
 * @hidden 
 * @namespace
 * Error classes that are thrown by the library
 * */
export * as errors from '~/v1/errors';

/** @hidden 
 * @namespace
 * @internal
 * Utility functions for transforming and combining iterables
 *
 * You are not supposed to use these functions directly.
 *Instead, use the methods of the `Stream` class.
 * */
export * as generators from '~/v1/generators';

