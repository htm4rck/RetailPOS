import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    // Crear la aplicación NestJS
    const app = await NestFactory.create(AppModule, {
        logger: ['log', 'error', 'warn', 'debug'], // Habilitar niveles de registro
    });
    app.useGlobalPipes(new ValidationPipe());

    // Configuración de Swagger
    const config = new DocumentBuilder()
        .setTitle('POS Backend API')
        .setDescription('API para gestionar el sistema POS')
        .setVersion('1.0')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document);

    // Configuración del puerto
    const PORT = process.env.PORT || 3000;

    // Manejo de errores y logs durante el arranque
    try {
        await app.listen(PORT);
        console.log(`Application is running on: http://localhost:${PORT}`);
        console.log(`Swagger is available at: http://localhost:${PORT}/api-docs`);
    } catch (error) {
        console.error('Error starting the application', error);
        process.exit(1); // Salir si hay un error crítico
    }
}

bootstrap();
