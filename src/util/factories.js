const factories = {
  inCase: (funcVal) => (prop, msgCase) => funcVal(prop) ? msgCase : prop
}

export default factories