import {Entity, PrimaryGeneratedColumn, Column, OneToMany, Unique} from "typeorm"
import {IsEmail} from "class-validator";
import {Order} from "./Order";

@Entity()
@Unique(['email'])
export class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column()
    password: string

    @Column()
    @IsEmail()
    email: string

    @Column({default: true})
    isActive: boolean

    @OneToMany(() => Order, order => order.user)
    orders: Order[]
}
