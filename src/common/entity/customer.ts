import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn} from "typeorm"
import {Address} from "./address"

var crypto = require('crypto');

@Entity()
export class Customer {

    @PrimaryGeneratedColumn() 
    id: number

    @ManyToOne(() => Address)
    @JoinColumn()
    billing: Address

    @ManyToOne(() => Address)
    @JoinColumn()
    delivery: Address

    @Column()
    name: String

    @Column()
    mobile: String

    @Column()
    email: String

    @Column()
    salt: String

    @Column()
    password: String

    correctPassword(candidate: String) {
        const hash = crypto.pbkdf2Sync(candidate, this.salt, 1000, 64, `sha512`).toString(`hex`)
        return this.password === hash
    }
}