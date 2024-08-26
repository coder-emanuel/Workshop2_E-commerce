import { ArgumentsHost, Catch, HttpException, HttpStatus, ExceptionFilter } from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(excepcion: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = excepcion instanceof HttpException ? excepcion.getStatus(): HttpStatus.INTERNAL_SERVER_ERROR;

        const message = excepcion instanceof HttpException ? excepcion.getResponse(): excepcion;

        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message,
        });
    }
}