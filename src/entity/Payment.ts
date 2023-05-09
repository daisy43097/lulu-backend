import {
    Column,
    Entity, JoinColumn,
    ManyToMany,
    ManyToOne, OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Min} from "class-validator";
import {User} from "./User";
import {JoinTable} from "typeorm";
import {Order} from "./Order";

@Entity()
export class Payment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('decimal', {precision: 5, scale: 2})
    price: number;

    @Column('decimal', {precision: 5, scale: 2, default: 1.00})
    @Min(1)
    taxRate: number;

    @Column('decimal', {precision: 5, scale: 2})
    total: number;

    @OneToOne(() => Order, order => order.payment)
    @JoinColumn()
    order: Order;

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