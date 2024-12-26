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
    @PrimaryColumn({ comment: "Número o código de documento del cliente" })
    document: string;

    @Column({comment: "Nombre completo del cliente"})
    name: string; // Full name of the customer

    @Column({ nullable: true, comment: "Nombre comercial o razón social" })
    commercialName: string; // Commercial name or trade name

    @Column({comment: "Tipo de documento de identidad del cliente: DNI, RUC, OTROS"})
    documentType: string;

    @Column({comment: "Tipo de persona, Natural o Jurídica: SND, PJ, PN"})
    personType: string; // Type of person, e.g., Natural or Legal

    @Column({comment: "Tipo de agente: NINGUNO, PERCEPTOR, RETENEDOR"})
    agentType: string; // Type of agent, e.g., Individual or Company

    @Column({ nullable: true, comment: "Observaciones o notas" })
    observation: string; // Observations or notes

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
