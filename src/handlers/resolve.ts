import { Hono } from "hono";
import { validator } from "hono/validator";
import { resolveIdFromUrl } from "../lib/url";
import { resolveItunesId } from "../lib/itunes";
import { serializeQuery } from "../lib/util";

const app = new Hono();

app.get(
  "/",
  validator("query", (value, c) => {
    const rawUrl = serializeQuery(value["url"]);
    console.log(rawUrl);
    try {
      const url = new URL(rawUrl);
      return {
        url,
      };
    } catch (_e) {
      return c.text("Invalid URL", 400);
    }
  }),
  async (c) => {
    const { url } = c.req.valid("query");

    const resolved = resolveIdFromUrl(url);
    if (!resolved || !resolved.id) {
      return c.notFound();
    }

    switch (resolved.service) {
      case "itunes": {
        const data = await resolveItunesId(resolved.id);
        if (!data) {
          return c.notFound();
        }
        return c.json(data);
      }
      default:
        return c.notFound();
    }
  },
);

export default app;
