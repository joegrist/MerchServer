import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn} from "typeorm"
import {Merchant} from "./merchant"
import {Product} from "./product"

@Entity()
export class Design {

    @PrimaryGeneratedColumn() 
    id: number

    @ManyToOne(() => Merchant)
    @JoinColumn()
    merchant: Merchant

    @ManyToOne(() => Product)
    @JoinColumn()
    product: Product

    @Column() 
    name: string

}