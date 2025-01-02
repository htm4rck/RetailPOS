import { Body, Controller,Headers, Post, Put, ValidationPipe } from '@nestjs/common';
import { CustomerDto } from './dto/customer.dto';
import { AddressDto } from './dto/address.dto';
import {CustomerService} from "./customer.service";

@Controller('customers')
export class CustomerController {
    constructor(private readonly customersService: CustomerService) {}

    @Post()
    async createCustomer(
        @Body(new ValidationPipe({ whitelist: true })) customerDto: CustomerDto,
        @Headers('schema-key') schema_key?: string,
    ): Promise<string> {
        const schemaKey = schema_key ?? '';
        return this.customersService.createOrUpdateCustomer(schemaKey, customerDto, 'system');
    }

    @Put('address')
    async createOrUpdateAddress(
        @Body(new ValidationPipe({ whitelist: true })) addressDto: AddressDto,
        @Headers('schema-key') schema_key?: string,
    ): Promise<string> {
        const schemaKey = schema_key ?? '';
        return this.customersService.createOrUpdateAddress(
            schemaKey,
            addressDto.customerDocument,
            addressDto,
            'system',
        );
    }
}
