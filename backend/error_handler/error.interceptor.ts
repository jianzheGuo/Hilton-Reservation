import { ExceptionFilter, Catch, ArgumentsHost } from "@nestjs/common";
import { logError } from "./winston";
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    logError(exception);
  }
}
