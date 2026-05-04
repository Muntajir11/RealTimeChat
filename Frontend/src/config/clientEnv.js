export function getSocketBaseUrl() {
	if (import.meta.env.VITE_SOCKET_URL) {
		return import.meta.env.VITE_SOCKET_URL;
	}
	if (import.meta.env.DEV) {
		return "http://localhost:5000";
	}
	if (typeof window !== "undefined") {
		return window.location.origin;
	}
	return "";
}
