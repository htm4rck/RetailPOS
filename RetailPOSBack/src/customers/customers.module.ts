import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { Customer } from './customer.entity';
import {Address} from "./address.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Customer, Address])],
    controllers: [CustomersController],
    providers: [CustomersService],
})
export class CustomersModule {}
