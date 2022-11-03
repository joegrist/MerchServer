import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from "typeorm"
import { Customer } from "./customer"
import { Design } from "./design"

@Entity()
export class CustomerDesign {

    @PrimaryColumn() 
    id: string

    @ManyToOne(() => Customer)
    @JoinColumn()
    customer: Customer

    @ManyToOne(() => Design)
    @JoinColumn()
    design: Design

    @Column() 
    quantity: number = 0
    
    @Column({ nullable: true })
    variation: string

    @Column({ nullable: true })
    purchased: Date

    @Column() 
    priceCents: number = 0
}