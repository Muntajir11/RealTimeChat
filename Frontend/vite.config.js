import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		port: 3000,
		proxy: {
			"/api": {
				target: "http://localhost:5000",
				changeOrigin: true,
				cookieDomainRewrite: "localhost",
				configure(proxy) {
					proxy.on("proxyReq", (proxyReq) => {
						if (!proxyReq.getHeader("origin")) {
							proxyReq.setHeader("origin", "http://localhost:3000");
						}
					});
				},
			},
		},
	},
});