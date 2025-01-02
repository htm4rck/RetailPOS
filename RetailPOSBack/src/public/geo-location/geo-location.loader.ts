import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { GeoLocation } from './entity/geo-location.entity';
import * as fs from 'fs';
import * as path from 'path';
import * as csvParser from 'csv-parser';

@Injectable()
export class GeoLocationLoaderService implements OnApplicationBootstrap {
    private readonly logger = new Logger(GeoLocationLoaderService.name);
    private readonly BATCH_SIZE = 500;

    constructor(
        @InjectRepository(GeoLocation)
        private readonly geoLocationRepository: Repository<GeoLocation>,
    ) {}

    async onApplicationBootstrap() {

        this.logger.log('Entities loaded:', JSON.stringify(this.geoLocationRepository.manager.connection.entityMetadatas));
        const entityFound = this.geoLocationRepository.manager.connection.entityMetadatas.find(
            (entity) => entity.name === 'GeoLocation'
        );
        this.logger.log(`GeoLocation entity found: ${entityFound ? 'Yes' : 'No'}`);

        const isTableCreated = await this.geoLocationRepository.manager
            .query(`SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'geo_location')`);

        if (!isTableCreated[0].exists) {
            this.logger.error('GeoLocation table is not created yet.');
            return;
        }

        this.logger.log('GeoLocation table is ready. Proceeding to load data...');
        console.log('GeoLocationLoaderService: Starting onApplicationBootstrap');
        this.logger.log('Starting GeoLocationLoaderService...');
        this.logger.log(`Metadata: ${JSON.stringify(this.geoLocationRepository.metadata)}`);
        const metadata = this.geoLocationRepository.metadata;
        if (!metadata) {
            this.logger.error('Metadata for GeoLocation is not loaded.');
            return;
        }
        const filePath = path.join(__dirname, '../../resource/geo_location.csv');

        if (!fs.existsSync(filePath)) {
            console.warn(`CSV file not found: ${filePath}`);
            return;
        }

        const geoLocations: GeoLocation[] = [];
        const readStream = fs.createReadStream(filePath);
        const parser = readStream.pipe(csvParser({
            separator: ';',
            headers: ['country', 'countryCode', 'department', 'province', 'district', 'geoLocation'],
            skipLines: 1
        }));

        for await (const row of parser) {
            const geoLocation = this.geoLocationRepository.create({
                country: row.country,
                countryCode: row.countryCode,
                department: row.department,
                province: row.province,
                district: row.district,
                geoLocation: row.geoLocation,
            });
            geoLocations.push(geoLocation);

            if (geoLocations.length >= this.BATCH_SIZE) {
                await this.saveBatch(geoLocations);
                geoLocations.length = 0; // Clear the array
            }
        }

        if (geoLocations.length > 0) {
            await this.saveBatch(geoLocations);
        }

        this.logger.log('GeoLocation data loaded successfully from CSV.');
    }

    private async saveBatch(geoLocations: GeoLocation[]) {
        const geoLocationIds = geoLocations.map(gl => gl.geoLocation);
        const existingGeoLocations = await this.geoLocationRepository.find({
            where: { geoLocation: In(geoLocationIds) },
            select: ['geoLocation']
        });

        const existingGeoLocationIds = new Set(existingGeoLocations.map(gl => gl.geoLocation));
        const newGeoLocations = geoLocations.filter(gl => !existingGeoLocationIds.has(gl.geoLocation));

        this.logger.log(`Found ${existingGeoLocations.length} existing GeoLocations in this batch.`);
        this.logger.log(`Saved ${newGeoLocations.length} new GeoLocations in this batch.`);

        if (newGeoLocations.length > 0) {
            await this.geoLocationRepository.save(newGeoLocations);
        }
    }
}