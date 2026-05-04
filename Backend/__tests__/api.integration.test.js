import { describe, it, expect, beforeAll, afterAll } from "vitest";
import mongoose from "mongoose";
import request from "supertest";

let mongod;
let server;

const signupPayload = {
	fullName: "Integration User",
	username: "intuser",
	email: "intuser@example.com",
	password: "password12",
	confirmPassword: "password12",
	gender: "male",
};

beforeAll(async () => {
	process.env.NODE_ENV = "test";
	process.env.JWT_SECRET = "test-jwt-secret-value-at-least-32-characters";
	const { MongoMemoryServer } = await import("mongodb-memory-server");
	mongod = await MongoMemoryServer.create();
	process.env.MONGO_URI = mongod.getUri();
	await mongoose.connect(process.env.MONGO_URI);

	const { app, server: httpServer } = await import("../socket/socket.js");
	const { default: configureExpress } = await import("../bootstrap/configureExpress.js");
	configureExpress(app);
	server = httpServer;

	const signup = await request(server).post("/api/auth/signup").send(signupPayload);
	expect(signup.status).toBe(201);
});

afterAll(async () => {
	await mongoose.disconnect();
	if (mongod) await mongod.stop();
});

describe("HTTP API", () => {
	it("rejects unauthenticated access to users", async () => {
		const res = await request(server).get("/api/users");
		expect(res.status).toBe(401);
	});

	it("logs in with cookie session and loads sidebar", async () => {
		const agent = request.agent(server);
		const login = await agent.post("/api/auth/login").send({
			username: "intuser",
			password: "password12",
		});
		expect(login.status).toBe(201);

		const sidebar = await agent.get("/api/users");
		expect(sidebar.status).toBe(200);
		expect(Array.isArray(sidebar.body)).toBe(true);
	});

	it("lists conversations for authenticated user", async () => {
		const agent = request.agent(server);
		await agent.post("/api/auth/login").send({
			username: "intuser",
			password: "password12",
		});
		const res = await agent.get("/api/conversations");
		expect(res.status).toBe(200);
		expect(Array.isArray(res.body)).toBe(true);
	});
});
