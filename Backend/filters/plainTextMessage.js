export function stripControlChars(input) {
	if (typeof input !== "string") return "";
	return input.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "");
}
