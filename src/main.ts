import {BadRequestException, ValidationPipe} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {NestFactory} from '@nestjs/core';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';
import cookieParser from 'cookie-parser';

import {ExceptionsFilter} from './filters/errors.filter';
import {PostStatusInterceptor} from './interceptors/status-code.interceptor';
import {AppModule} from './modules/app.module';

const globalPrefix = 'v1';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const configService = app.get(ConfigService);
    const port = configService.get<number>('PORT') || 3001;

    app.use(cookieParser());

    app.setGlobalPrefix(globalPrefix);

    const config = new DocumentBuilder()
        .setTitle('Mini CRM')
        .setDescription('API мини CRM')
        .setVersion('1.0')
        .addBearerAuth()
        .addSecurityRequirements('bearer')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document);
    app.useGlobalInterceptors(new PostStatusInterceptor());
    app.useGlobalFilters(new ExceptionsFilter());
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            stopAtFirstError: true,
            exceptionFactory: (errors) => {
                const message = errors?.[0]?.constraints
                    ? Object.values(errors[0].constraints)[0]
                    : 'Validation failed';

                return new BadRequestException(message);
            },
        }),
    );

    await app.listen(port);
}

bootstrap();
