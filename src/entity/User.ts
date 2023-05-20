import {Entity, PrimaryGeneratedColumn, Column, OneToMany, Unique} from "typeorm"
import {IsEmail} from "class-validator";
import {Order} from "./Order";
import {BaseClass} from "./BaseClass";
import {ShoppingBag} from "./ShoppingBag";

@Entity()
export class User extends BaseClass{

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column()
    password: string

    @Column({
        unique: true
    })
    @IsEmail()
    email: string

    @OneToMany(() => Order, order => order.user)
    orders: Order[]
    //
    // @OneToMany(() => ShoppingBag, shoppingBag => shoppingBag.user)
    // shoppingBag: ShoppingBag[]
}
