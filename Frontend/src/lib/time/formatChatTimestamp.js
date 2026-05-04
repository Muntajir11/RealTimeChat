export function formatChatTimestamp(isoString) {
	const d = new Date(isoString);
	if (Number.isNaN(d.getTime())) return "";
	return d.toLocaleString(undefined, {
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
}
