import {Entity, Column, PrimaryGeneratedColumn} from "typeorm"

@Entity()
export class Merchant {

    @PrimaryGeneratedColumn() 
    id: number

    @Column() 
    name: string

}