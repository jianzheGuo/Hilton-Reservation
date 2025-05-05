// import { Cluster, connect, ConnectOptions } from "couchbase";
// import { logError } from "../error_handler/winston";

// const clusterConnStr = "couchbases://cb.fvepphynmw3azvab.cloud.couchbase.com";
// const username = "hiltion-access";
// const password = "jQVWMJDCD_6X9Sc";

// const connectOptions: ConnectOptions = {
//   username: username,
//   password: password,
//   // Sets a pre-configured profile called "wanDevelopment" to help avoid latency issues
//   // when accessing Capella from a different Wide Area Network
//   // or Availability Zone (e.g. your laptop).
//   configProfile: "wanDevelopment",
//   timeouts: {
//     connectTimeout: 30000,
//     kvTimeout: 10000,
//   },
// };

// const connectToDB = async () => {
//   const cluster: Cluster = await connect(clusterConnStr, connectOptions);
//   return cluster;
// };

// const connectToDBwithRetry = async () => {
//   let count: number = 0;
//   let cluster: Cluster | null = null;
//   while (count < 3) {
//     try {
//       cluster = await connectToDB();
//       break;
//     } catch (error) {
//       logError(error);
//       count++;
//     }
//   }
//   return cluster;
// };

// export { connectToDBwithRetry };

import { logError } from "../error_handler/winston";
import { MongoClient, ServerApiVersion } from "mongodb";

const uri =
  "mongodb+srv://chrisjguo:jyQzFjuX4PYtaT1r@cluster0.2cf5fys.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

class MongoDBConnection {
  private static instance: MongoDBConnection;
  private client: MongoClient;
  private isConnected: boolean = false;

  private constructor() {
    this.client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
  }

  public static getInstance(): MongoDBConnection {
    if (!MongoDBConnection.instance) {
      MongoDBConnection.instance = new MongoDBConnection();
    }
    return MongoDBConnection.instance;
  }

  public async connect(): Promise<MongoClient> {
    if (!this.isConnected) {
      try {
        await this.client.connect();
        await this.client.db("admin").command({ ping: 1 });
        console.log("成功连接到MongoDB!");
        this.isConnected = true;
      } catch (error) {
        console.error("连接MongoDB失败:", error);
        throw error;
      }
    }
    return this.client;
  }

  public async connectWithRetry(): Promise<MongoClient> {
    let retryCount = 0;
    const maxRetries = 3;

    while (retryCount < maxRetries) {
      try {
        if (!this.isConnected) {
          await this.client.connect();
          await this.client.db("admin").command({ ping: 1 });
          console.log("成功连接到MongoDB!");
          this.isConnected = true;
        }
        return this.client;
      } catch (error) {
        retryCount++;
        logError(
          `MongoDB连接失败 (尝试 ${retryCount}/${maxRetries}): ${error}`,
        );

        if (retryCount >= maxRetries) {
          console.error(`已达到最大重试次数(${maxRetries})，无法连接到MongoDB`);
          await this.close();
          throw error;
        }

        const delay = Math.min(1000 * Math.pow(2, retryCount - 1), 5000);
        console.log(`将在 ${delay}ms 后重试连接...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
    return this.client;
  }

  public async close(): Promise<void> {
    if (this.isConnected) {
      try {
        await this.client.close();
        console.log("MongoDB连接已关闭");
        this.isConnected = false;
      } catch (error) {
        console.error("关闭MongoDB连接失败:", error);
      }
    }
  }

  public getClient(): MongoClient {
    return this.client;
  }
}

// 导出单例实例和便捷方法
const mongoConnection = MongoDBConnection.getInstance();
const getClient = () => mongoConnection.getClient();
const connectToMongoDBWithRetry = () => mongoConnection.connectWithRetry();
const closeConnection = () => mongoConnection.close();

export { getClient, connectToMongoDBWithRetry, closeConnection };
