// api/whitelist.js

const CIPHER_MAP = {
	q: "a", w: "b", e: "c", r: "d", t: "e", y: "f", u: "g", i: "h", o: "i", p: "j",
	a: "k", s: "l", d: "m", f: "n", g: "o", h: "p", j: "q", k: "r", l: "s", z: "t",
	x: "u", c: "v", v: "w", b: "x", n: "y", m: "z",
	Q: "A", W: "B", E: "C", R: "D", T: "E", Y: "F", U: "G", I: "H", O: "I", P: "J",
	A: "K", S: "L", D: "M", F: "N", G: "O", H: "P", J: "Q", K: "R", L: "S", Z: "T",
	X: "U", C: "V", V: "W", B: "X", N: "Y", M: "Z",
	"5": "0", "6": "1", "7": "2", "8": "3", "9": "4",
	"0": "5", "1": "6", "2": "7", "3": "8", "4": "9"
};

// Whitelist database (replace with actual database)
const WHITELIST = [
	"NULL_99907",
	"TestUser123",
	"PremiumPlayer"
];

function decryptUsername(encrypted) {
	let decrypted = "";
	for (let i = 0; i < encrypted.length; i++) {
		const char = encrypted[i];
		decrypted += CIPHER_MAP[char] || char;
	}
	return decrypted;
}

function generateToken() {
	const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	let token = "";
	for (let i = 0; i < 35; i++) {
		token += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return token;
}

function encodeToken(token) {
	// Half and half encoding: split token, encode first half with cipher, second half stays same
	const mid = Math.floor(token.length / 2);
	const firstHalf = token.substring(0, mid);
	const secondHalf = token.substring(mid);
	
	let encoded = "";
	for (let i = 0; i < firstHalf.length; i++) {
		const char = firstHalf[i];
		encoded += CIPHER_MAP[char] || char;
	}
	encoded += secondHalf;
	
	return encoded;
}

export default function handler(req, res) {
	if (req.method !== "POST") {
		return res.status(405).json({ error: "Method not allowed" });
	}

	const { username: encryptedUsername } = req.body;

	if (!encryptedUsername) {
		return res.status(400).json({ error: "Missing username" });
	}

	// Decrypt username
	const decrypted = decryptUsername(encryptedUsername);
	console.log(`Decrypted: ${decrypted}`);

	// Check whitelist
	const isWhitelisted = WHITELIST.includes(decrypted);

	if (!isWhitelisted) {
		return res.status(200).json({
			status: "Fax - False"
		});
	}

	// Generate token
	const rawToken = generateToken();
	const encodedToken = encodeToken(rawToken);

	return res.status(200).json({
		status: "prem - True",
		access: "Yes",
		token: encodedToken
	});
}
