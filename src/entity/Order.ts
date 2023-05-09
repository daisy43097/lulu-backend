import {
    Column,
    Entity,
    ManyToOne, OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Min} from "class-validator";
import {User} from "./User";
import {JoinTable} from "typeorm";
import {Payment} from "./Payment";



@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('decimal', {precision: 5, scale: 2})
    price: number;

    @Column('decimal', {precision: 5, scale: 2, default: 1.00})
    @Min(1)
    taxRate: number;

    @Column('decimal', {precision: 5, scale: 2})
    total: number;

    @OneToOne(() => Payment, payment => payment.order)
    payment: Payment;

    @ManyToOne(() => User, user => user.orders)
    user: User

    @Column()
    isActive: boolean;

    @Column()
    isDelete: boolean;

    @Column()
    @UpdateDateColumn()
    createAt: Date;

    @Column()
    @UpdateDateColumn()
    updateAt: Date;

}