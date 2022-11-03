import {Entity, Column, PrimaryColumn, ManyToOne, JoinColumn} from "typeorm"
import {Address} from "./address"

var crypto = require('crypto');

@Entity()
export class Customer {

    @PrimaryColumn()
    email: string

    @ManyToOne(() => Address)
    @JoinColumn()
    billing: Address

    @ManyToOne(() => Address)
    @JoinColumn()
    delivery: Address

    @Column()
    name: string

    @Column()
    mobile: string

    @Column()
    salt: string

    @Column()
    password: string

    correctPassword(candidate: string) {
        const hash = crypto.pbkdf2Sync(candidate, this.salt, 1000, 64, `sha512`).toString(`hex`)
        return this.password === hash
    }
}