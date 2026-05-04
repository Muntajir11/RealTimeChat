const NBSP = /\u00a0/g;

export function sanitizeMessagePreview(text, maxLen = 160) {
	if (typeof text !== "string") return "";
	const collapsed = text.replace(NBSP, " ").replace(/\s+/g, " ").trim();
	if (collapsed.length <= maxLen) return collapsed;
	return `${collapsed.slice(0, maxLen - 1)}…`;
}
