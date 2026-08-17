import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthContextProvider } from "../context/AuthContext.jsx";
import { SocketContextProvider } from "../context/SocketContext.jsx";
import App from "../App.jsx";

export function renderApp(route = "/login") {
	return render(
		<MemoryRouter initialEntries={[route]}>
			<AuthContextProvider>
				<SocketContextProvider>
					<App />
				</SocketContextProvider>
			</AuthContextProvider>
		</MemoryRouter>,
	);
}
