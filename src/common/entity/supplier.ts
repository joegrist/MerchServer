import {Entity, Column, PrimaryColumn} from "typeorm"

@Entity()
export class Supplier {

    @PrimaryColumn() 
    slug: string

    @Column() 
    name: string
}