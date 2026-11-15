import { Hono } from "hono";
import resolve from "./routes/resolve";
import search from "./routes/search";

const app = new Hono().basePath("/api/v1");

app.route("/resolve", resolve);
app.route("/search", search);

export default app;
