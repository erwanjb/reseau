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
    Check
} from "typeorm";
import { User } from "../users/users.entity";
import { Project } from "./projects.entity";
import { AdminRoleEnum } from "./enums/adminRoleEnum";

@Entity()
@Check(` (("demande" = FALSE OR "demande" IS NULL OR "invitation" = FALSE OR "invitation" IS NULL) AND "adminRole" IS NULL)::BOOLEAN IS TRUE OR  ("demande" = TRUE AND "invitation" = TRUE AND "adminRole" IS NOT NULL)::BOOLEAN IS TRUE`)
@Check('("invitation" = TRUE AND "role" IS NOT NULL)::BOOLEAN IS TRUE OR (("invitation" = FALSE OR "invitation" IS NULL) AND "role" IS NULL)::BOOLEAN IS TRUE')
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

    @Column({nullable: true})
    demande: boolean

    @Column({nullable: true})
    invitation:boolean

    @Column({ nullable: true, type: 'text'})
    messageInvitation: string

    @Column({ nullable: true, type: 'text'})
    messageDemande: string

    @Column({nullable: true})
    role: string;

    @Column({nullable: true, type: 'enum', enum: AdminRoleEnum})
    adminRole: AdminRoleEnum
}