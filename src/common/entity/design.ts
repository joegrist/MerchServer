import {Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn} from "typeorm"
import {Merchant} from "./merchant"
import {Product} from "./product"

@Entity()
export class Design {

    @PrimaryGeneratedColumn() 
    id: number

    @OneToOne(() => Merchant)
    @JoinColumn()
    merchant: Merchant

    @OneToOne(() => Product)
    @JoinColumn()
    product: Product

    @Column() 
    name: string

}