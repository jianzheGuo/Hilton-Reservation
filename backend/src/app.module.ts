import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MongooseModule } from "@nestjs/mongoose";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";

import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";
import { ReserveModule } from "./reserve/reserve.module";
import { join } from "path";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".development.env", // 明确指定路径
      ignoreEnvFile: false, // 确保加载.env文件
    }),
    MongooseModule.forRoot(
      process.env.MONGO_URI || "mongodb://localhost:27017/fallback-db",
    ),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), "src/schema.gql"),
      sortSchema: true,
      playground: true,
    }),
    AuthModule,
    UserModule,
    ReserveModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
