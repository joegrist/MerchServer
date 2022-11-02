import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn} from "typeorm"
import {Customer} from "./customer"
import {Design} from "./design"

@Entity()
export class CustomerDesign {

    @PrimaryGeneratedColumn() 
    id: number

    @ManyToOne(() => Customer)
    @JoinColumn()
    customer: Customer

    @ManyToOne(() => Design)
    @JoinColumn()
    design: Design

    @Column() 
    quantity: number = 0
    
    @Column() 
    variation: string | null

    @Column() 
    purchased: Date | null

}