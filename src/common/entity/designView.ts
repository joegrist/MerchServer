import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn} from "typeorm"
import {Design} from "./design"
import {View} from "./view"

@Entity()
export class DesignView {

    @PrimaryGeneratedColumn() 
    id: number

    @ManyToOne(() => Design)
    @JoinColumn()
    design: Design

    @ManyToOne(() => View)
    @JoinColumn()
    view: View

    @Column()
    background: number

}