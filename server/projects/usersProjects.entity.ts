import {
    BaseEntity,
    Entity,
    Column,
    PrimaryColumn,
    JoinColumn,
    PrimaryGeneratedColumn,
    ManyToOne,
    ManyToMany,
    JoinTable,
    OneToMany,
} from "typeorm";
import { User } from "../users/users.entity";
import { Project } from "./projects.entity";
import { AdminRoleEnum } from "./enums/adminRoleEnum";

@Entity()
export class UserProject extends BaseEntity {
    @PrimaryColumn('uuid') 
    userId: string;

    @ManyToOne(() => User, user => user.projectUser) // inverse "userPlaces: UserPlace[]" is one-to-many in user
    @JoinColumn({ name: "userId" })
    user: User;

    @PrimaryColumn('uuid') 
    projectId: string;

    @ManyToOne(() => Project, project => project.userProject) // inverse "userPlaces: UserPlace[]" is one-to-many in place
    @JoinColumn({ name: "projectId" })
    project: Project;

    @Column()
    role: string;

    @Column({ type: 'enum', enum: AdminRoleEnum})
    adminRole: AdminRoleEnum
}