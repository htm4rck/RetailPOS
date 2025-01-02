import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {Repository, Like, ILike} from 'typeorm';
import { GeoLocation } from './entity/geo-location.entity';
import {GeoLocationResponseDto} from "./dto/geo-location.dto";

@Injectable()
export class GeoLocationService {
    constructor(
        @InjectRepository(GeoLocation)
        private readonly geoLocationRepository: Repository<GeoLocation>,
    ) {}

    async findAll(): Promise<GeoLocation[]> {
        return this.geoLocationRepository.find();
    }

    async findOne(id: number): Promise<GeoLocation | null> {
        return this.geoLocationRepository.findOne({ where: { id } });
    }

    async create(geoLocationDto: GeoLocation): Promise<GeoLocation> {
        const newGeoLocation = this.geoLocationRepository.create(geoLocationDto);
        return this.geoLocationRepository.save(newGeoLocation);
    }

    async update(id: number, updateData: Partial<GeoLocation>): Promise<string> {
        await this.geoLocationRepository.update(id, updateData);
        return `GeoLocation with ID ${id} updated successfully.`;
    }

    async softDelete(id: number): Promise<string> {
        await this.geoLocationRepository.softDelete(id);
        return `GeoLocation with ID ${id} deleted successfully.`;
    }

    async findBySearch(search: string): Promise<GeoLocationResponseDto[]> {
        const results = await this.geoLocationRepository.find({
            where: [
                { district: ILike(`%${search}%`) },
                // { province: Like(`%${search}%`) },
                // { department: Like(`%${search}%`) },
                { geoLocation: Like(`%${search}%`) },
            ],
        });

        // Mapear resultados a GeoLocationResponseDto
        return results.map((geoLocation) => {
            // Construir el campo `formato`
            const formatoParts = [
                geoLocation.department,
                geoLocation.province,
                geoLocation.district,
            ].filter((part) => part && part.trim() !== ''); // Eliminar valores nulos/vacíos

            const formattedLocation = formatoParts.join('/');

            // Determinar si es seleccionable
            const isSelectable =
                !!geoLocation.department &&
                !!geoLocation.province &&
                !!geoLocation.district;

            return {
                ...geoLocation,
                formattedLocation,
                isSelectable,
            };
        });
    }
}