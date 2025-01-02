import { DataSource } from 'typeorm';
import { publicDataSource } from './public/public.datasource';

export const initializeDatabase = async () => {
    const tempDataSource = new DataSource({
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        username: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASS || 'yourpassword',
        database: 'postgres',
        synchronize: false,
        logging: true,
    });

    await tempDataSource.initialize();

    const dbName = process.env.DB_NAME || 'pos_system';
    try {
        await tempDataSource.query(`CREATE DATABASE "${dbName}"`);
        console.log(`Database "${dbName}" created successfully.`);
    } catch (error: any) {
        if (error.code === '42P04') {
            console.log(`Database "${dbName}" already exists.`);
        } else {
            throw error;
        }
    }

    await tempDataSource.destroy();
    try {
        await publicDataSource.initialize();
        console.log('Public DataSource initialized successfully.');

        // Si `synchronize: true` está habilitado, creará las tablas automáticamente
        await publicDataSource.synchronize();
        console.log('Entities synchronized successfully.');
    } catch (error) {
        console.error('Error initializing Public DataSource:', error);
        throw error;
    }
};
