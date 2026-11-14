import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { validator } from "hono/validator";
import { resolveIdFromUrl } from "../lib/url";
import { resolveItunesId } from "../lib/itunes";

const app = new Hono();

app.post(
  "/",
  validator("header", (value) => {
    if (value["content-type"] !== "application/json") {
      throw new HTTPException(400, {
        message: "Content-Type is required",
      });
    }
  }),
  validator("json", (value, c) => {
    const rawUrl = value["url"];
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
    const body = c.req.valid("json");
    const { url } = body;

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
