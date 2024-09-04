import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { Generator } from "./generator/generator";

dotenv.config();

const app: Express = express();
const generator = new Generator();

app.get("/data", (req: Request, res: Response) => {
	res.json(generator.generate_data(Number(req.query.count), Number(req.query.offset)));
});

app.listen(process.env.SOURCE_SERVICE_PORT, () => {
	console.log(`[server]: Server is running at http://localhost:${process.env.SOURCE_SERVICE_PORT}`);
});