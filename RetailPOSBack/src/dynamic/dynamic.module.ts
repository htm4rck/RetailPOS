import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DynamicController } from './dynamic.controller';
import { DynamicService } from './dynamic.service';
import { CustomerController } from './crm/customer/customer.controller';
import { CustomerService } from './crm/customer/customer.service';
import { Customer } from './crm/customer/entity/customer.entity';
import { Address } from './crm/customer/entity/address.entity';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useFactory: () => ({
                type: 'postgres',
                host: process.env.DB_HOST || 'localhost',
                port: parseInt(process.env.DB_PORT || '5432', 10),
                username: process.env.DB_USER || 'postgres',
                password: process.env.DB_PASS || 'yourpassword',
                database: process.env.DB_NAME || 'pos_system',
                entities: [Customer, Address],
                synchronize: false,
            }),
        }),
        TypeOrmModule.forFeature([Customer, Address]),
    ],
    controllers: [DynamicController, CustomerController],
    providers: [DynamicService, CustomerService],
})
export class DynamicModule {}