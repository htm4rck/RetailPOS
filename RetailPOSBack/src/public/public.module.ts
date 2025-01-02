
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GeoLocation } from './geo-location/entity/geo-location.entity';
import {GeoLocationModule} from "./geo-location/geo-location.module";

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '5432', 10),
            username: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASS || 'yourpassword',
            database: process.env.DB_NAME || 'pos_system',
            schema: 'public',
            entities: [GeoLocation],
            autoLoadEntities: true,
            synchronize: false,
            dropSchema: false,
            logging: true,

        }),
        TypeOrmModule.forFeature([GeoLocation]),
        GeoLocationModule,
    ],
})
export class PublicModule {}
