/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise       *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Return Promise object that is resolved with string value === 'Hooray!!! She said "Yes"!',
 * if boolean value === true is passed, resolved with string value === 'Oh no, she said "No".',
 * if boolean value === false is passed, and rejected
 * with error message === 'Wrong parameter is passed! Ask her again.',
 * if is not boolean value passed
 *
 * @param {boolean} isPositiveAnswer
 * @return {Promise}
 *
 * @example
 *    const p1 = willYouMarryMe(true);
 *    p1.then(answer => console.log(answer)) // 'Hooray!!! She said "Yes"!'
 *
 *    const p2 = willYouMarryMe(false);
 *    p2.then(answer => console.log(answer)) // 'Oh no, she said "No".';
 *
 *    const p3 = willYouMarryMe();
 *    p3.then(answer => console.log(answer))
 *      .catch((error) => console.log(error.message)) // 'Error: Wrong parameter is passed!
 *                                                    //  Ask her again.';
 */
function willYouMarryMe(isPositiveAnswer) {
  // return new Promise((res, rej) => {
  //   if (isPositiveAnswer === undefined) {
  //     rej(Error('Wrong parameter is passed! Ask her again.'));
  //   } else if (isPositiveAnswer) {
  //     res('Hooray!!! She said "Yes"!');
  //   } else {
  //     res('Oh no, she said "No".');
  //   }
  // });
  if (isPositiveAnswer === undefined) return Promise.reject(Error('Wrong parameter is passed! Ask her again.'));
  if (isPositiveAnswer) return Promise.resolve('Hooray!!! She said "Yes"!');
  return Promise.resolve('Oh no, she said "No".');
}


/**
 * Return Promise object that should be resolved with array containing plain values.
 * Function receive an array of Promise objects.
 *
 * @param {Promise[]} array
 * @return {Promise}
 *
 * @example
 *    const promises = [Promise.resolve(1), Promise.resolve(3), Promise.resolve(12)]
 *    const p = processAllPromises(promises);
 *    p.then((res) => {
 *      console.log(res) // => [1, 2, 3]
 *    })
 *
 */
async function processAllPromises(array) {
  // const result = [];

  // // array.map((el) => el.then((val) => result.push(val)));
  // array.map(async (el) => {
  //   const resolved = await el;
  //   result.push(resolved);
  // });

  // return Promise.resolve(result);
  const arrOfObjectResults = await Promise.allSettled(array);
  const resultArr = arrOfObjectResults.filter((obj) => obj.status === 'fulfilled').map((el) => el.value);
  return Promise.resolve(resultArr);
}

/**
 * Return Promise object that should be resolved with value received from
 * Promise object that will be resolved first.
 * Function receive an array of Promise objects.
 *
 * @param {Promise[]} array
 * @return {Promise}
 *
 * @example
 *    const promises = [
 *      Promise.resolve('first'),
 *      new Promise(resolve => setTimeout(() => resolve('second'), 500)),
 *    ];
 *    const p = processAllPromises(promises);
 *    p.then((res) => {
 *      console.log(res) // => [first]
 *    })
 *
 */
async function getFastestPromise(array) {
  const resultValue = await Promise.race(array);
  return Promise.resolve([resultValue]);
}

/**
 * Return Promise object that should be resolved with value that is
 * a result of action with values of all the promises that exists in array.
 * If some of promise is rejected you should catch it and process the next one.
 *
 * @param {Promise[]} array
 * @param {Function} action
 * @return {Promise}
 *
 * @example
 *    const promises = [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)];
 *    const p = chainPromises(promises, (a, b) => a + b);
 *    p.then((res) => {
 *      console.log(res) // => 6
 *    });
 *
 */
async function chainPromises(array, action) {
  const resultsArr = [];
  await array.map(async (prom) => {
    try {
      resultsArr.push(await prom);
    } catch (e) {
      // e
    }
  });

  const result = resultsArr.reduce(action);

  return Promise.resolve(result);
}

module.exports = {
  willYouMarryMe,
  processAllPromises,
  getFastestPromise,
  chainPromises,
};
