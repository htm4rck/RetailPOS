import {
    Entity,
    PrimaryColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    OneToMany,
} from 'typeorm';
import { Address } from './address.entity';

@Entity()
export class Customer {
    @PrimaryColumn()
    document: string; // Primary key - Document number, unique for each customer

    @Column()
    name: string; // Full name of the customer

    @Column({ nullable: true })
    commercialName: string; // Commercial name or trade name

    @Column()
    documentType: string; // Document type, e.g., DNI, RUC

    @Column()
    agentType: string; // Type of agent, e.g., Individual or Company

    @Column({ nullable: true })
    observation: string; // Observations or notes

    @Column({ default: false })
    isTransportAgency: boolean; // Indicates if the customer is a transport agency

    @Column({ nullable: true })
    email: string; // Email address of the customer

    @Column({ nullable: true })
    paymentCondition: string; // Payment terms or conditions

    @Column({ nullable: true })
    priceList: string; // Price list applicable to the customer

    @Column({ nullable: true })
    sourceApplication: string; // Application where the customer data originates

    @Column({ nullable: true })
    customerGroup: string; // Customer grouping for categorization

    @Column({ default: true })
    status: string; // Active or inactive status

    @OneToMany(() => Address, (address) => address.customer, {
        cascade: ['insert', 'update'], // Automatically handle related addresses
        onDelete: 'CASCADE', // Delete all related addresses if customer is deleted
    })
    addresses: Address[]; // List of associated addresses

    @CreateDateColumn()
    createdAt: Date; // Timestamp when the record was created

    @UpdateDateColumn()
    updatedAt: Date; // Timestamp when the record was last updated

    @DeleteDateColumn()
    deletedAt: Date; // Timestamp when the record was deleted (soft delete)

    @Column({ nullable: true })
    createdBy: string; // User who created the record

    @Column({ nullable: true })
    updatedBy: string; // User who last updated the record

    @Column({ nullable: true })
    deletedBy: string; // User who deleted the record
}
