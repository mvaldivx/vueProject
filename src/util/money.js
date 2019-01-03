import currency from 'currency.js'

const toMXN = (value, symbol = '$', precision = 2) => currency(value, { symbol, precision }).format(true);

export default {
	toMXN
}