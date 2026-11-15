import { Hono } from "hono";
import { validator } from "hono/validator";
import {
  ALLOWED_ITUNES_ENTITY_TYPES,
  ITunesEntityType,
  searchItunes,
} from "../lib/itunes";
import { serializeQuery } from "../lib/util";

const app = new Hono();

app.get(
  "/",
  validator("query", (value, c) => {
    const query = serializeQuery(value["query"]);
    const type = serializeQuery(value["type"]);
    if (!query) {
      return c.text("Provide query", 400);
    }
    if (!type) {
      return c.text("Provide type", 400);
    }
    if (!ALLOWED_ITUNES_ENTITY_TYPES.includes(type)) {
      return c.text("Provide valid type (song, musicArtist, album)", 400);
    }
    return {
      query,
      type: type as ITunesEntityType,
    };
  }),
  async (c) => {
    const { query, type } = c.req.valid("query");
    const itunes = await searchItunes(query, type);
    return c.json({
      itunes,
    });
  },
);

export default app;
