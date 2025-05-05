import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

import { connectToMongoDBWithRetry } from "../database/connection";
// import test from "./sample";

async function bootstrap() {
  const mongodbClient = await connectToMongoDBWithRetry();
  // await test(cluster, "travle-sample");

  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
