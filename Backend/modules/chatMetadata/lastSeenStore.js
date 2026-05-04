const lastSeenByPair = new Map();

function pairKey(a, b) {
	const x = String(a);
	const y = String(b);
	return x < y ? `${x}:${y}` : `${y}:${x}`;
}

export function markPeerSeen(userId, peerId) {
	lastSeenByPair.set(pairKey(userId, peerId), Date.now());
}

export function getLastSeen(userId, peerId) {
	return lastSeenByPair.get(pairKey(userId, peerId)) ?? null;
}
