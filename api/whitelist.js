		Proof: proof(nonce, access, status, token),
	});
}

export default function handler(req, res) {
	if (req.method !== "POST") return res.status(405).json({ error: "no" });

	let body = req.body;
	if (typeof body === "string") {
		try { body = JSON.parse(body); } catch { body = null; }
	}
	const { u, n, t } = body || {};

	if (typeof u !== "string" || typeof n !== "string" || typeof t !== "number")
		return res.status(400).json({ error: "bad" });
	if (!/^[A-Za-z0-9]{16}$/.test(n) || u.length > 40)
		return res.status(400).json({ error: "bad" });

	if (Math.abs(Date.now() / 1000 - t) > 60)
		return res.status(400).json({ error: "expired" });
	if (nonceUsed(n))
		return res.status(400).json({ error: "replay" });

	const username = dec(u);

	if (!WHITELIST.includes(username)) {
		return reply(res, n, false, "Fax - False", "");
	}
	return reply(res, n, true, "prem - True", makeToken());
}
