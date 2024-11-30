import { ENV } from "@/config/env.ts";
import express from "express";
import cors from "cors";
import { iamRouter } from "./modules/iam/iam.router.ts";
import { analyticRouter } from "./modules/analytic/analytics.router.ts";
import { errorHandler } from "@/middleware/errorHandler.ts";
import { initDatabase } from "@/config/database.ts";

const app = express();

await initDatabase();

app.use(cors());
app.use(express.json());

app.use("/v1/iam", iamRouter);
app.use("/v1/analytic", analyticRouter);

// Error handling
app.use(errorHandler);

app.listen(ENV.PORT, () => {
  console.log(`Server running at http://localhost:${ENV.PORT}`);
});
