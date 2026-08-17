export function getSocketBaseUrl() {
	return import.meta.env.VITE_SOCKET_URL || "";
}
