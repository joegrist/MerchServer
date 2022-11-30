import {Entity, Column, PrimaryGeneratedColumn, ManyToOne} from "typeorm"
import { Supplier } from "./supplier"

@Entity()
export class Product {

    @PrimaryGeneratedColumn() 
    id: number

    @Column() 
    name: string

    @ManyToOne(() => Supplier)
    supplier: Supplier
}