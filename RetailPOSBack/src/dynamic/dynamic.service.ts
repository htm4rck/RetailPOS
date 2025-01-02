import { Injectable } from '@nestjs/common';
import { DataSource, DataSourceOptions } from 'typeorm';
import {Customer} from "./crm/customer/entity/customer.entity";
import {Address} from "./crm/customer/entity/address.entity";

@Injectable()
export class DynamicService {
    constructor(private readonly dataSource: DataSource) {}

    async initializeSchemas(key: string) {
        const schemas = [`${key}crm`, `${key}inventory`];
        for (const schema of schemas) {
            await this.dataSource.query(`CREATE SCHEMA IF NOT EXISTS "${schema}"`);
            await this.initializeDynamicDataSource(schema);
        }

        return { message: 'Schemas initialized successfully', schemas };
    }

    private async initializeDynamicDataSource(schema: string) {
        const dynamicDataSource = new DataSource({
            type: 'postgres',
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '5432', 10),
            username: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASSWORD || 'yourpassword',
            database: process.env.DB_NAME || 'pos_system',
            schema,
            entities: [Customer, Address],
            synchronize: true,
        });

        await dynamicDataSource.initialize();
        await dynamicDataSource.destroy();
    }

    async schemaExists(schema: string): Promise<boolean> {
        const result = await this.dataSource.query(
            `SELECT schema_name FROM information_schema.schemata WHERE schema_name = $1`,
            [schema],
        );
        return result.length > 0;
    }
}
