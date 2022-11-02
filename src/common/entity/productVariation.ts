import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn} from "typeorm"
import {Product} from "./product"

@Entity()
export class ProductVariation {

    @PrimaryGeneratedColumn() 
    id: number

    @ManyToOne(() => Product)
    @JoinColumn()
    product: Product

    @Column() 
    name: string

    @Column() 
    variationsCommaSeparated: string

}