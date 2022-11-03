import {Entity, Column, PrimaryColumn} from "typeorm"

@Entity()
export class Merchant {

    @PrimaryColumn() 
    slug: string

    @Column() 
    name: string

}