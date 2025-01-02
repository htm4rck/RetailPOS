import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entity/customer.entity';
import { Address } from './entity/address.entity';
import { CustomerDto } from './dto/customer.dto';
import { AddressDto } from './dto/address.dto';

@Injectable()
export class CustomerService {
    constructor(
        @InjectRepository(Customer)
        private readonly customerRepository: Repository<Customer>,
        @InjectRepository(Address)
        private readonly addressRepository: Repository<Address>,
    ) {}

    async createOrUpdateCustomer(schema_key:string, customerDto: CustomerDto, createdBy: string): Promise<string> {
        const schema = !schema_key ? 'crm' : `${schema_key}crm`;
        await this.customerRepository.query(`SET search_path TO "${schema}", public`);
        const existingCustomer = await this.customerRepository.findOne({
            where: { document: customerDto.document },
            relations: ['addresses'],
        });

        const uniqueAddresses = this.removeDuplicateAddresses(customerDto.addresses);

        if (existingCustomer) {
            existingCustomer.name = customerDto.name;
            existingCustomer.commercialName = customerDto.commercialName || existingCustomer.commercialName;
            existingCustomer.documentType = customerDto.documentType;
            existingCustomer.agentType = customerDto.agentType || existingCustomer.agentType;
            existingCustomer.observation = customerDto.observation || existingCustomer.observation;
            existingCustomer.updatedBy = createdBy;

            await this.addressRepository.delete({ customerDocument: existingCustomer.document });

            existingCustomer.addresses = [... uniqueAddresses.map((addressDto) => {
                const address = this.addressRepository.create(addressDto);
                address.customerDocument = existingCustomer.document;
                address.createdBy = createdBy;
                return address;
            })];
            await this.customerRepository.save(existingCustomer);
            return 'Customer and addresses updated successfully.';
        }

        const newCustomer = this.customerRepository.create(customerDto);
        newCustomer.createdBy = createdBy;
        newCustomer.addresses = uniqueAddresses.map((addressDto) => {
            const address = this.addressRepository.create(addressDto);
            address.customerDocument = customerDto.document;
            address.createdBy = createdBy;
            return address;
        });

        await this.customerRepository.save(newCustomer);
        return 'Customer and addresses created successfully.';
    }

    async createOrUpdateAddress(
        schema_key:string,
        document: string,
        addressDto: AddressDto,
        createdBy: string,
    ): Promise<string> {
        const schema = !schema_key ? 'crm' : `${schema_key}crm`;
        await this.customerRepository.query(`SET search_path TO ${schema}, public`);
        if (!document) {
            throw new Error('Customer document is required.');
        }

        const existingAddress = await this.addressRepository.findOne({
            where: { customerDocument: document, serialNumber: addressDto.serialNumber },
        });

        if (existingAddress) {
            if (existingAddress.customerDocument !== document) {
                throw new Error(`Address with serialNumber ${addressDto.serialNumber} does not belong to customer ${document}.`);
            }

            const { customerDocument, ...updateData } = addressDto;

            await this.addressRepository.update(
                { customerDocument: document, serialNumber: addressDto.serialNumber },
                {
                    ...updateData,
                    updatedBy: createdBy,
                },
            );
            return `Address with serialNumber ${addressDto.serialNumber} updated successfully for customer ${document}.`;
        }

        const newAddress = this.addressRepository.create(addressDto);
        newAddress.customerDocument = document;
        newAddress.createdBy = createdBy;
        await this.addressRepository.save(newAddress);
        return `Address with serialNumber ${addressDto.serialNumber} created successfully for customer ${document}.`;
    }

    private removeDuplicateAddresses(addresses: AddressDto[]): AddressDto[] {
        const uniqueAddresses = new Map<string, AddressDto>();
        addresses.forEach((address) => {
            const key = `${address.customerDocument}-${address.serialNumber}`;
            if (!uniqueAddresses.has(key)) {
                uniqueAddresses.set(key, address);
            }
        });
        return Array.from(uniqueAddresses.values());
    }
}