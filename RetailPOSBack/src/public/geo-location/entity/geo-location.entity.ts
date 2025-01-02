import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
} from 'typeorm';

@Entity('geo_location')
export class GeoLocation {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    country: string;

    @Column()
    countryCode: string;

    @Column()
    department: string;

    @Column()
    province: string;

    @Column()
    district: string;

    @Column()
    geoLocation: string; // Latitude, Longitude format

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt?: Date; // Optional for soft delete
}
