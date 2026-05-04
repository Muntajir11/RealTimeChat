import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	plugins: [react()],
	test: {
		globals: true,
		setupFiles: [path.join(rootDir, "Frontend/src/test/setup.js")],
		include: ["Backend/**/__tests__/**/*.test.js", "Frontend/src/**/*.test.jsx", "Frontend/src/**/*.test.js"],
		environmentMatchGlobs: [
			["Backend/**", "node"],
			["Frontend/**", "jsdom"],
		],
		fileParallelism: false,
		poolOptions: {
			threads: {
				singleThread: true,
			},
		},
	},
	resolve: {
		alias: {
			"@": path.join(rootDir, "Frontend/src"),
		},
	},
});
