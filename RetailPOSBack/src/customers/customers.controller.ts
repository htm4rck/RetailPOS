import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { Customer } from './customer.entity';
import { Address } from './address.entity';

@Controller('customers')
export class CustomersController {
    constructor(private readonly customersService: CustomersService) {}

    @Get()
    async getAllCustomers(): Promise<Customer[]> {
        return await this.customersService.findAll();
    }

    @Post()
    async createOrUpdateCustomer(
        @Body() customerDto: Customer,
        @Body('createdBy') createdBy: string,
    ): Promise<string> {
        return await this.customersService.createOrUpdateCustomer(customerDto, createdBy);
    }

    @Patch(':document')
    async updateCustomer(
        @Param('document') document: string,
        @Body() updateData: Partial<Customer>,
        @Body('updatedBy') updatedBy: string,
    ): Promise<string> {
        return await this.customersService.update(document, updateData, updatedBy);
    }

    @Delete(':document')
    async deleteCustomer(@Param('document') document: string, @Body('deletedBy') deletedBy: string): Promise<string> {
        return await this.customersService.softDelete(document, deletedBy);
    }

    @Post(':document/address')
    async createOrUpdateAddress(
        @Param('document') document: string,
        @Body() addressDto: Address,
        @Body('createdBy') createdBy: string,
    ): Promise<string> {
        return await this.customersService.createOrUpdateAddress(document, addressDto, createdBy);
    }

    @Patch(':document/address/:serialNumber')
    async updateAddress(
        @Param('document') document: string,
        @Param('serialNumber') serialNumber: string,
        @Body() updateData: Partial<Address>,
        @Body('updatedBy') updatedBy: string,
    ): Promise<string> {
        return await this.customersService.updateAddress(document, serialNumber, updateData, updatedBy);
    }

    @Delete(':document/address/:serialNumber')
    async deleteAddress(
        @Param('document') document: string,
        @Param('serialNumber') serialNumber: string,
        @Body('deletedBy') deletedBy: string,
    ): Promise<string> {
        return await this.customersService.deleteAddress(document, serialNumber, deletedBy);
    }
}