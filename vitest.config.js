import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	plugins: [react()],
	test: {
		globals: true,
		environment: "jsdom",
		setupFiles: [path.join(rootDir, "src/test/setup.js")],
		include: ["src/**/*.test.{js,jsx}"],
		restoreMocks: true,
	},
	resolve: {
		alias: {
			"@": path.join(rootDir, "src"),
		},
	},
});
