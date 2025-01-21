import { AfterCreate, AfterFind, AllowNull, BeforeCreate, Column, DataType, Default, Index, Length, NotEmpty, Table, Unique } from "sequelize-typescript";
import * as argon from 'argon2';
import { BadRequestException } from "@nestjs/common";
import { BaseModel } from "./base.model";
import { Role, Status } from "../constants";

@Table({
    tableName: 'user_table',
    timestamps: true,
    defaultScope: {
        attributes: { exclude: ['hash', 'passwordChangedAt', 'passwordResetToken', 'passwordResetToken'] },
    },
})
export class User extends BaseModel {
    @NotEmpty({
        msg: 'Username must not be empty'
    })
    @Length({max: 64})
    @Column(DataType.STRING)
    username: string;

    @Index
    @Unique(true)
    @Length({max: 64})
    @Column(DataType.STRING)
    email: string;
  
    @Default(Role.GHOST)
    @Column(DataType.ENUM(...Object.values(Role)))
    role: Role;
  
    @Column(DataType.STRING)
    hash: string;

    @Column(DataType.DATE)
    passwordChangedAt?: Date;

    @Column(DataType.STRING)
    passwordResetToken?: string;
  
    @Column(DataType.DATE)
    passwordResetExpires?: Date;
    
    @AllowNull(true)
    @Column(DataType.DATE)
    dataToCall: Date;

    @Default(Status.IDLE)
    @Column(DataType.ENUM(...Object.values(Status)))
    status: Status;

    @Default(0)
    @Column(DataType.INTEGER)
    numberOfContributions: number;

    @BeforeCreate
    static async hashPassword(instance: User) {
        if (instance.hash) {
            instance.hash = await argon.hash(instance.hash);
        } else {
            throw new BadRequestException('Please provide a password when you are creating a user');
        }
    }
}