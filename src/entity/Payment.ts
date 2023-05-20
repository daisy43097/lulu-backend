import {
    Column,
    Entity, JoinColumn, OneToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import {BaseClass} from "./BaseClass";
import {Min} from "class-validator";
import {Order} from "./Order";

@Entity()
export class Payment extends BaseClass{
    @PrimaryGeneratedColumn()
    id: number;

    @Column('decimal', {precision: 5, scale: 2, default: 1.00})
    @Min(1)
    taxRate: number;

    @Column('decimal', {precision: 5, scale: 2})
    total: number;

    @OneToOne(() => Order, order => order.payment)
    order: Order

    @Column()
    billAddress: string;

    @Column()
    shipAddress: string;

    @Column({nullable: true})
    customerId: string

    @Column({nullable: true})
    paymentId: string

    @Column({
        type: 'enum',
        enum: ['processing', 'paid'],
        default: 'processing'
    })
    status: string;
}