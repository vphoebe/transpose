import { Hono } from "hono";
import resolve from "./handlers/resolve";
import search from "./handlers/search";

const app = new Hono();

app.route("/resolve", resolve);
app.route("/search", search);

export default app;
