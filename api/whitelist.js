// api/whitelist.js  (Vercel serverless function)
// Env vars to set in Vercel dashboard:
//   SIGN_SECRET     = any long random string (must match SECRET in the Lua client)
//   PREMIUM_SCRIPT  = (optional) the Lua source only whitelisted users receive
const crypto = require("crypto");

const WHITELIST = ["NULL_99907"];

// Custom cipher (same map as client, inverted automatically for decrypt)
const ENC = {
	a:"q",b:"w",c:"e",d:"r",e:"t",f:"y",g:"u",h:"i",i:"o",j:"p",
	k:"a",l:"s",m:"d",n:"f",o:"g",p:"h",q:"j",r:"k",s:"l",t:"z",
	u:"x",v:"c",w:"v",x:"b",y:"n",z:"m",
	A:"Q",B:"W",C:"E",D:"R",E:"T",F:"Y",G:"U",H:"I",I:"O",J:"P",
	K:"A",L:"S",M:"D",N:"F",O:"G",P:"H",Q:"J",R:"K",S:"L",T:"Z",
	U:"X",V:"C",W:"V",X:"B",Y:"N",Z:"M",
	"0":"5","1":"6","2":"7","3":"8","4":"9",
	"5":"0","6":"1","7":"2","8":"3","9":"4",
};
const DEC = Object.fromEntries(Object.entries(ENC).map(([k, v]) => [v, k]));

const mapStr = (s, map) => [...s].map((c) => map[c] || c).join("");

function makeToken() {
	const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	const bytes = crypto.randomBytes(35);
	let t = "";
	for (let i = 0; i < 35; i++) t += chars[bytes[i] % chars.length];
	return t;
}
