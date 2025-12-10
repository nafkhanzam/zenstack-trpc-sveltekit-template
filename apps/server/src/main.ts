import { ZenStackMiddleware } from "@zenstackhq/server/express";
import { RPCApiHandler } from "@zenstackhq/server/api";
import { createContext, getClient } from "./context.js";
import { env } from "./env.js";
import { cors, express, trpcExpress } from "./lib.js";
import { appRouter } from "./router.ts";
import { schema } from "./zenstack/schema-lite";

(async () => {
  // express implementation
  const app = express();

  app.use(cors({}));
  app.use(express.json());

  app.use((req, _res, next) => {
    // request logger
    const body = (() => {
      if (req.body) {
        return req.body;
      }
      if (Object.keys(req.query).length > 0) {
        return req.query;
      }
      return "";
    })();
    console.log("⬅️ ", req.method, req.path, JSON.parse(JSON.stringify(body)));

    next();
  });

  app.use(
    "/trpc",
    trpcExpress.createExpressMiddleware({
      router: appRouter,
      createContext,
    }),
  );
  app.use(
    "/api/model",
    ZenStackMiddleware({
      apiHandler: new RPCApiHandler({
        schema,
        log(level, message, error) {
          if (level === "error") {
            console.error(">>>>>>>>", error, message);
            console.error(error);
            console.error("<<<<<<<<");
            console.error();
          }
        },
      }),
      // getSessionUser extracts the current session user from the request, its
      // implementation depends on your auth solution
      getClient,
    }),
  );
  app.get("/", (_req, res) => {
    res.send("hello");
  });
  app.get("/ping", (_req, res) => {
    res.send("pong");
  });
  app.use((req, res, next) => {
    res.status(404).send({ message: "Not found." });
  });
  app.listen(env.PORT, () => {
    console.log(`Listening on port ${env.PORT}...`);
  });
})();
