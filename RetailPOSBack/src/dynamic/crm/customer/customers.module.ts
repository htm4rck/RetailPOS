import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { Customer } from './entity/customer.entity';
import {Address} from "./entity/address.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Customer, Address])],
    controllers: [CustomerController],
    providers: [CustomerService],
})
export class CustomersModule {}
