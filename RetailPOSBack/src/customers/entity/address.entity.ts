import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    Unique,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    JoinColumn,
} from 'typeorm';
import { Customer } from './customer.entity';

@Entity()
@Unique(['serialNumber', 'customerDocument']) // Unicidad combinada: serialNumber + customerDocument
export class Address {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Customer, (customer: Customer) => customer.addresses, {
        onDelete: 'CASCADE', // Elimina direcciones si se elimina el cliente
        eager: false, // Evita cargas automáticas innecesarias
    })
    @JoinColumn({ name: 'customerDocument', referencedColumnName: 'document' }) // Relación con Customer.document
    customer: Customer;

    @Column()
    customerDocument: string; // Relación explícita con el cliente

    @Column()
    serialNumber: string; // Identificador único para cada dirección de un cliente

    @Column()
    address: string; // Dirección detallada

    @Column()
    type: string; // Tipo de dirección: 'entrega', 'facturación', etc.

    @Column()
    country: string;

    @Column()
    countryCode: string;

    @Column()
    department: string;

    @Column()
    province: string;

    @Column()
    district: string;

    @Column({ nullable: true })
    geoLocation: string; // Coordenadas geográficas (opcional)

    @Column({ default: 'active' })
    status: string; // Estado de la dirección (ej. activo o eliminado)

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt?: Date; // Eliminación lógica

    @Column({ nullable: true })
    createdBy?: string; // Usuario que creó

    @Column({ nullable: true })
    updatedBy?: string; // Usuario que actualizó

    @Column({ nullable: true })
    deletedBy?: string; // Usuario que eliminó
}