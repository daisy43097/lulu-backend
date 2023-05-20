import {
    Column,
    Entity, JoinColumn,
    ManyToOne, OneToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import {Min} from "class-validator";
import {User} from "./User";
import {BaseClass} from "./BaseClass";
import {Payment} from "./Payment";

@Entity()
export class Order extends BaseClass{
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => Payment, (payment) => payment.order, { cascade: true })
    @JoinColumn()
    payment: Payment;

    @ManyToOne(() => User, user => user.orders)
    // @JoinColumn({ name: "user_id" })
    user: User

    @Column()
    products: string;

    @Column({
        type: 'enum',
        enum: ['processing', 'processed'],
        default: 'processing'
    })
    status: string;
}

export interface ProductDTO {
    title: string
    price: string
    size: string
    color: string
    colorId: string
    image: string
    productId: string
    quantity: string
}

export interface OrderDTO{
    id: number
    payment: Payment
    products: ProductDTO[]
    status: string
    updateAt: Date
    createAt: Date
    isDelete: boolean
    isActive: boolean
}