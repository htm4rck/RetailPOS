import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    Unique,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
} from 'typeorm';
import { Customer } from './customer.entity';

@Entity()
@Unique(['serialNumber', 'customerDocument']) // Asegura unicidad en combinación con el documento del cliente
export class Address {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Customer, (customer) => customer.addresses, {
        onDelete: 'CASCADE', // Si el cliente se elimina, las direcciones asociadas también se eliminan
        eager: false, // Cargar la relación solo si es necesario
    })
    customer: Customer;

    @Column()
    customerDocument: string; // Relación con el documento del cliente para consultas eficientes

    @Column()
    serialNumber: string; // Identificador único por cliente

    @Column()
    address: string; // Dirección específica

    @Column()
    type: string; // 'entrega' o 'facturacion'

    @Column()
    country: string; // País de la dirección

    @Column()
    countryCode: string; // Código del país

    @Column()
    department: string; // Departamento o estado

    @Column()
    province: string; // Provincia

    @Column()
    district: string; // Distrito

    @Column({ nullable: true })
    geoLocation: string; // Coordenadas geográficas (opcional)

    @Column({ default: 'active' })
    status: string; // Estado: 'active' o 'deleted'

    @CreateDateColumn()
    createdAt: Date; // Fecha de creación

    @UpdateDateColumn()
    updatedAt: Date; // Fecha de última actualización

    @DeleteDateColumn()
    deletedAt?: Date; // Fecha de eliminación lógica (opcional)

    @Column({ nullable: true })
    createdBy?: string; // Usuario que creó la dirección

    @Column({ nullable: true })
    updatedBy?: string; // Usuario que actualizó la dirección

    @Column({ nullable: true })
    deletedBy?: string; // Usuario que eliminó la dirección
}
