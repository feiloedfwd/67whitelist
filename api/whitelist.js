// api/whitelist.js
const crypto = require("crypto");

const WHITELIST = ["NULL_99907"];

// ---- cipher (no key, fixed substitution) ----
const P = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const C = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM5678901234";
const ENC = {}, DEC = {};
for (let i = 0; i < P.length; i++) { ENC[P[i]] = C[i]; DEC[C[i]] = P[i]; }
const enc = (s) => s.split("").map((c) => ENC[c] || c).join("");
const dec = (s) => s.split("").map((c) => DEC[c] || c).join("");

const ALPHA = P;

// 34 random chars + 1 checksum char, first 17 chars cipher-encoded
function makeToken() {
	let raw = "";
	for (let i = 0; i < 34; i++) raw += ALPHA[crypto.randomInt(ALPHA.length)];
	let sum = 0;
	for (let i = 0; i < raw.length; i++) sum += raw.charCodeAt(i);
	raw += ALPHA[sum % ALPHA.length];
	return enc(raw.slice(0, 17)) + raw.slice(17); // 35 chars
}

// ---- proof: must match the Lua side exactly ----
function proof(nonce, access, status, token) {
	const s = [nonce, String(access), status, token].join("|");
	const rev = s.split("").reverse().join("");
	let out = "";
	for (let i = 1; i <= rev.length; i++) {
