const regexps = {
	email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,

	onlyNums: /^\d+$/,

	cuenta: /^[C|F][0-9]{0,8}$/i,

	cuentaCliente: /^C[0-9]{8}$/i,

	cuentaClienteFinal: /^F[0-9]{8}$/i,

	numCuenta: /^C[0-9]{0,8}$/i,

	onlyLetters: /^[a-z\sñ]+$/i,

	onlyLettersWithAcents: /^[a-z\sñáéíóúü]+$/i,
	
	nomina: /E\d{6}/,

	onlyIntegerWithNegatives: /^-?[0-9]+$/,
	
	hasConsecutiveChars: /[a-zA-Z]\\1{5-1}/
}

export default regexps