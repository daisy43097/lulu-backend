import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {BaseClass} from "./BaseClass";
import {User} from "./User";

@Entity()
export class ShoppingBag extends BaseClass {
    @PrimaryGeneratedColumn()
    id: number;

    // @ManyToOne(() => User, user => user.shoppingBag)
    // user: User

    @Column()
    title: string

    @Column()
    productId: string

    @Column()
    price: number

    @Column()
    size: string

    @Column()
    color: string

    @Column()
    colorId: string

    @Column()
    quantity: number

    @Column()
    image: string
}