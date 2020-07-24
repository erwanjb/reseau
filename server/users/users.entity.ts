import {
    BaseEntity,
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    ManyToMany,
    JoinTable,
} from "typeorm";

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ unique: true })
    email: string;

    @Column()
    firstName?: string;

    @Column()
    lastName?: string;

    @Column({ nullable: true })
    picture?: string;

    @Column()
    job: string;

    @Column({ type: 'longtext'})
    description: string;

    @Column({ width: 10 })
    phone: number;
}
