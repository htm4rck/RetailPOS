import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomersModule } from './customers/customers.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import {GeoLocationModule} from "./geo-location/geo-location.module";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'yourpassword',
      database: process.env.DB_NAME || 'pos_system',
      autoLoadEntities: true,
      synchronize: true,
      dropSchema: false,
      logging: true,
    }),
    CustomersModule,
    GeoLocationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
