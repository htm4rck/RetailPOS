import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './customer.entity';
import { Address } from './address.entity';

@Injectable()
export class CustomersService {
    constructor(
        @InjectRepository(Customer)
        private readonly customerRepository: Repository<Customer>,
        @InjectRepository(Address)
        private readonly addressRepository: Repository<Address>,
    ) {}

    findAll(): Promise<Customer[]> {
        return this.customerRepository.find({ relations: ['addresses'] });
    }

    async createOrUpdateCustomer(customerDto: Customer, createdBy: string): Promise<string> {
        // Verificar si el cliente ya existe
        const existingCustomer = await this.customerRepository.findOne({
            where: { document: customerDto.document },
            relations: ['addresses'],
        });

        if (existingCustomer) {
            // Actualizar cliente
            Object.assign(existingCustomer, customerDto);
            existingCustomer.updatedBy = createdBy;

            // Verificar direcciones
            if (customerDto.addresses) {
                for (const addressDto of customerDto.addresses) {
                    const existingAddress = existingCustomer.addresses.find(
                        (addr) => addr.serialNumber === addressDto.serialNumber
                    );

                    if (existingAddress) {
                        // Actualizar dirección existente
                        Object.assign(existingAddress, addressDto);
                        existingAddress.updatedBy = createdBy;
                    } else {
                        // Crear nueva dirección
                        const newAddress = this.addressRepository.create(addressDto);
                        newAddress.customerDocument = customerDto.document;
                        newAddress.createdBy = createdBy;
                        existingCustomer.addresses.push(newAddress);
                    }
                }
            }

            await this.customerRepository.save(existingCustomer);
            return 'Customer and addresses updated successfully.';
        }

        // Crear nuevo cliente
        const newCustomer = this.customerRepository.create(customerDto);
        newCustomer.createdBy = createdBy;

        if (customerDto.addresses) {
            newCustomer.addresses = customerDto.addresses.map((addressDto) => {
                const newAddress = this.addressRepository.create(addressDto);
                newAddress.customerDocument = customerDto.document;
                newAddress.createdBy = createdBy;
                return newAddress;
            });
        }

        await this.customerRepository.save(newCustomer);
        return 'Customer and addresses created successfully.';
    }

    async update(document: string, data: Partial<Customer>, updatedBy: string): Promise<string> {
        const existingCustomer = await this.customerRepository.findOne({ where: { document } });
        if (!existingCustomer) {
            throw new Error(`Customer with document ${document} not found.`);
        }

        // Actualizar datos
        Object.assign(existingCustomer, data);
        existingCustomer.updatedBy = updatedBy;

        await this.customerRepository.save(existingCustomer);
        return `Customer ${document} updated successfully.`;
    }

    async softDelete(document: string, deletedBy: string): Promise<string> {
        const customer = await this.customerRepository.findOne({ where: { document } });
        if (!customer) {
            throw new Error(`Customer with document ${document} not found.`);
        }

        customer.status = 'deleted';
        customer.deletedAt = new Date();
        customer.deletedBy = deletedBy;

        await this.customerRepository.save(customer);
        return `Customer ${document} deleted successfully.`;
    }

    async updateAddress(
        document: string,
        serialNumber: string,
        updateData: Partial<Address>,
        updatedBy: string,
    ): Promise<string> {
        const address = await this.addressRepository.findOne({
            where: { customerDocument: document, serialNumber },
        });

        if (!address) {
            throw new Error(`Address with serialNumber ${serialNumber} for customer ${document} not found.`);
        }

        // Actualizar los campos enviados
        Object.assign(address, updateData);
        address.updatedBy = updatedBy;

        await this.addressRepository.save(address);
        return `Address with serialNumber ${serialNumber} updated successfully for customer ${document}.`;
    }

    async deleteAddress(document: string, serialNumber: string, deletedBy: string): Promise<string> {
        const address = await this.addressRepository.findOne({
            where: { customerDocument: document, serialNumber },
        });

        if (!address) {
            throw new Error(`Address with serialNumber ${serialNumber} for customer ${document} not found.`);
        }

        if (address.status === 'deleted') {
            return `Address with serialNumber ${serialNumber} is already deleted for customer ${document}.`;
        }

        // Actualizar estado y auditoría
        address.status = 'deleted';
        address.deletedAt = new Date();
        address.deletedBy = deletedBy;

        await this.addressRepository.save(address);
        return `Address with serialNumber ${serialNumber} deleted successfully for customer ${document}.`;
    }

    async createOrUpdateAddress(
        document: string,
        addressDto: Address,
        createdBy: string,
    ): Promise<string> {
        // Buscar cliente asociado al documento
        const customer = await this.customerRepository.findOne({ where: { document } });

        if (!customer) {
            throw new Error(`Customer with document ${document} not found.`);
        }

        // Buscar dirección existente por serialNumber
        const existingAddress = await this.addressRepository.findOne({
            where: { customerDocument: document, serialNumber: addressDto.serialNumber },
        });

        if (existingAddress) {
            // Actualizar dirección existente
            Object.assign(existingAddress, addressDto);
            existingAddress.updatedBy = createdBy;
            await this.addressRepository.save(existingAddress);
            return `Address with serialNumber ${addressDto.serialNumber} updated successfully for customer ${document}.`;
        } else {
            // Crear nueva dirección
            const newAddress = this.addressRepository.create(addressDto);
            newAddress.customerDocument = document;
            newAddress.createdBy = createdBy;
            await this.addressRepository.save(newAddress);
            return `Address with serialNumber ${addressDto.serialNumber} created successfully for customer ${document}.`;
        }
    }
}
