import {BadRequestException, ClassSerializerInterceptor, ValidationPipe} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {NestFactory, Reflector} from '@nestjs/core';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';

import {AppModule} from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const configService = app.get(ConfigService);
    const port = configService.get<number>('PORT') || 3001;

    const config = new DocumentBuilder()
        .setTitle('Mini CRM')
        .setDescription('API мини CRM')
        .setVersion('1.0')
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document);

    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
    // app.useGlobalFilters(new ExceptionsFilter());
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
