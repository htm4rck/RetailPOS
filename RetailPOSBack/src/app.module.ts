import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomersModule } from './customers/customers.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'yourpassword',
      database: process.env.DB_NAME || 'pos_system',
      autoLoadEntities: true, // Carga automáticamente las entidades
      synchronize: true, // Sincroniza automáticamente el esquema (solo para desarrollo)
      dropSchema: true,
      logging: true, // Habilitar el registro de consultas SQL
    }),
    CustomersModule,
  ], // Módulos que tu aplicación importa
  controllers: [AppController], // Controladores raíz
  providers: [AppService], // Servicios raíz
})
export class AppModule {}
