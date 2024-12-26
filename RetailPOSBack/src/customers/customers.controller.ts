import { Body, Controller, Post, Put, ValidationPipe } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomerDto } from './dto/customer.dto';
import { AddressDto } from './dto/address.dto';

@Controller('customers')
export class CustomersController {
    constructor(private readonly customersService: CustomersService) {}

    @Post()
    async createCustomer(
        @Body(new ValidationPipe({ whitelist: true })) customerDto: CustomerDto,
    ): Promise<string> {
        return this.customersService.createOrUpdateCustomer(customerDto, 'system');
    }

    @Put('address')
    async createOrUpdateAddress(
        @Body(new ValidationPipe({ whitelist: true })) addressDto: AddressDto,
    ): Promise<string> {
        return this.customersService.createOrUpdateAddress(
            addressDto.customerDocument,
            addressDto,
            'system',
        );
    }
}
