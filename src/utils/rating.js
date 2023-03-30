/**
 * Get the correct ending of the word (temp & dumb solution)
 *
 * @param rate
 * @return {string}
 */
const wordEnding = (rate) => {
    let ending = 'ов'
    if (rate === 1) {
        ending = ''
    }
    if (rate > 1 && rate < 5) {
        ending = 'а'
    }
    return ending
}

/**
 * Fn to get review rating
 *
 * @param reviewRate
 * @param userRates
 * @return {{ending: string, rate: number}}
 */
export function rating (reviewRate, userRates) {
    const rates = []

    rates.push(reviewRate)

    if (userRates.length) userRates.forEach(r => rates.push(r.rate))

    const rate = parseInt(rates.reduce((r, i) => r + i, 0) / (rates.length || 1) + '')

    return {
        rate,
        ending: wordEnding(rate)
    }
}