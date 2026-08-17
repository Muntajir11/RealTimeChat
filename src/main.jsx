import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthContextProvider } from "./context/AuthContext.jsx";
import { SocketContextProvider } from "./context/SocketContext.jsx";

async function enableMockApi() {
	const { worker } = await import("./mocks/browser.js");
	await worker.start({
		onUnhandledRequest: "bypass",
		serviceWorker: { url: "/mockServiceWorker.js" },
	});
}

enableMockApi().then(() => {
	ReactDOM.createRoot(document.getElementById("root")).render(
		<React.StrictMode>
			<BrowserRouter>
				<AuthContextProvider>
					<SocketContextProvider>
						<App />
					</SocketContextProvider>
				</AuthContextProvider>
			</BrowserRouter>
		</React.StrictMode>,
	);
});
