import moment from 'moment'
import money  from './money' 

const filters = {
  formatDate: val => moment(val).format('DD/MM/YYYY'),

  formatTime: val => moment(val, 'HHmmss').format('hh:mm:ss A'),

  toMXN: (value, symbol, precision) => money.toMXN(value, symbol, precision),

  formatOnlyTime: val => moment(val).format('hh:mm:ss A')
}

export default filters