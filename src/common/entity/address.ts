import { StatsBase } from "fs"
import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn} from "typeorm"

@Entity()
export class Address {

    @PrimaryGeneratedColumn() 
    id: number

    @Column() 
    line1: string | null

    @Column() 
    line2: string | null

    @Column() 
    city: string | null

    @Column() 
    state: string | null

    @Column() 
    country: string | null

    @Column() 
    zip: string | null
}