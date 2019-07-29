import _ from 'lodash';

/**
 * Delays execution for a given time without blocking a thread and resumes it after
 * a specified time.
 * @param {Number} timeMillis time in milliseconds.
 */
export function delay(timeMillis) {
  return new Promise((resolve) => {
    setTimeout(() => { resolve(); }, timeMillis);
  });
}

// /**
//  * Check input param is object or not.
//  * @param {Any} item anything
//  * @returns {Boolean} true if it is an object, or false for otherwise.
//  */
// function isObject(item) {
//   return (item && typeof item === 'object' && !Array.isArray(item));
// }


// export function deepMerge(target, ...sources) {
//   if (!sources.length) return target;
//   const source = sources.shift();

//   if (isObject(target) && isObject(source)) {
//     for (const key in source) {
//       if (isObject(source[key])) {
//         if (!target[key]) Object.assign(target, { [key]: {} });
//         deepMerge(target[key], source[key]);
//       } else {
//         Object.assign(target, { [key]: source[key] });
//       }
//     }
//   }

//   return deepMerge(target, ...sources);
// }

/**
 * Merge objects deeply.
 * @param {Object} target base object.
 * @param {Object} ...sources
 */
export function deepMerge(object, ...sources) {
  return _.merge(object, sources);
}
