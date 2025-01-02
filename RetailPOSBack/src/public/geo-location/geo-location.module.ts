import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GeoLocation } from './entity/geo-location.entity';
import { GeoLocationService } from './geo-location.service';
import { GeoLocationController } from './geo-location.controller';
import {GeoLocationLoaderService} from "./geo-location.loader";

@Module({
    imports: [TypeOrmModule.forFeature([GeoLocation])],
    providers: [GeoLocationService, GeoLocationLoaderService],
    controllers: [GeoLocationController],
    exports: [GeoLocationService],
})
export class GeoLocationModule {}