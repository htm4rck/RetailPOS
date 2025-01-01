import {Controller, Get, Post, Patch, Delete, Param, Body, NotFoundException, Query} from '@nestjs/common';
import { GeoLocationService } from './geo-location.service';
import { GeoLocation } from './geo-location.entity';
import {GeoLocationResponseDto} from "./geo-location.dto";

@Controller('geo-locations')
export class GeoLocationController {
    constructor(private readonly geoLocationService: GeoLocationService) {}

    @Get()
    async getGeoLocation(
        @Query('search') search: string,
    ): Promise<GeoLocationResponseDto[]> {
        const geoLocations = await this.geoLocationService.findBySearch(search);
        if (geoLocations.length === 0) {
            throw new NotFoundException(`No GeoLocations found matching search criteria`);
        }
        return geoLocations;
    }

    @Post()
    async createGeoLocation(@Body() geoLocationDto: GeoLocation): Promise<GeoLocation> {
        return this.geoLocationService.create(geoLocationDto);
    }

    @Patch(':id')
    async updateGeoLocation(
        @Param('id') id: number,
        @Body() updateData: Partial<GeoLocation>,
    ): Promise<string> {
        return this.geoLocationService.update(id, updateData);
    }

    @Delete(':id')
    async deleteGeoLocation(@Param('id') id: number): Promise<string> {
        return this.geoLocationService.softDelete(id);
    }
}