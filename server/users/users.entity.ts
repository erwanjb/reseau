import {
    BaseEntity,
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    ManyToMany,
    JoinTable,
    OneToMany
} from "typeorm";
import { StatusEnum } from "./enums/statusEnum";
import { UserProject } from "../projects/usersProjects.entity";
import { UserMission } from "../projects/usersMissions.entity";

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ unique: true })
    email: string;

    @Column({ type: "enum", enum: StatusEnum })
    status: StatusEnum;

    @Column({ nullable: true })
    confirmToken: string; 

    @Column()
    password: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ nullable: true })
    picture?: string;

    @Column()
    job: string;

    @Column({ type: 'text'})
    description: string;

    @Column({ length: 10 })
    phone: string;

    @OneToMany(() => UserProject, userProject => userProject.user)
    projectUser: UserProject[]

    @OneToMany(() => UserMission, userMission => userMission.user)
    missionUser
}
