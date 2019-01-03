const print = {
	text3d: (msg) => {
		var css = `text-shadow: -1px -1px hsl(0,100%,50%), 
														 1px 1px hsl(5.4, 100%, 50%), 
														 3px 2px hsl(10.8, 100%, 50%), 
														 5px 3px hsl(16.2, 100%, 50%), 
														 7px 4px hsl(21.6, 100%, 50%), 
														 9px 5px hsl(27, 100%, 50%), 
														 11px 6px hsl(32.4, 100%, 50%), 
														 13px 7px hsl(37.8, 100%, 50%), 
														 14px 8px hsl(43.2, 100%, 50%), 
														 16px 9px hsl(48.6, 100%, 50%), 
														 18px 10px hsl(54, 100%, 50%), 
														 20px 11px hsl(59.4, 100%, 50%), 
														 22px 12px hsl(64.8, 100%, 50%), 
														 23px 13px hsl(70.2, 100%, 50%), 
														 25px 14px hsl(75.6, 100%, 50%); 
														 font-size: 40px;`;
		console.log("%c%s", css, msg);
	}
}

export default print