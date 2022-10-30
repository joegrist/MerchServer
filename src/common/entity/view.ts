import {Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne} from "typeorm"
import {Product} from "./product"

@Entity()
export class View {

    @PrimaryGeneratedColumn() 
    id: number

    @ManyToOne(() => Product)
    @JoinColumn()
    product: Product

    @Column() 
    name: string

    @Column() 
    productIllustrationWidthPx: number

    @Column() 
    productIllustrationHeightPx: number

    @Column() 
    printAreaWidthPx: number

    @Column() 
    printAreaHeightPx: number

    @Column() 
    printAreaOriginXPx: number

    @Column() 
    printAreaOriginYPx: number

    @Column() 
    printAreaWidthMm: number

    @Column() 
    printAreaHeightMm: number

}