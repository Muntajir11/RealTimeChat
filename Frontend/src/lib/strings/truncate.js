export function truncate(str, max = 80) {
	if (typeof str !== "string") return "";
	if (str.length <= max) return str;
	return `${str.slice(0, max - 1)}…`;
}
