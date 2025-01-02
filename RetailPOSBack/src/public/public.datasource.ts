import { DataSource } from 'typeorm';
import { GeoLocation } from './geo-location/entity/geo-location.entity';

export const publicDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'yourpassword',
    database: process.env.DB_NAME || 'pos_system', // Base de datos creada dinámicamente
    schema: 'public',
    entities: [GeoLocation],
    synchronize: true,
    logging: true,
});
