import {
    BaseEntity,
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    ManyToMany,
    JoinTable,
    OneToMany,
    JoinColumn,
} from "typeorm";
import { StatusEnum } from "./enums/statusEnum";
import { UserMission } from "./usersMissions.entity";
import { Project } from "./projects.entity";
import { timer } from "rxjs";

@Entity()
export class Mission extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column('uuid') 
    projectId: string;

    @Column()
    time: string;

    @Column({ nullable: true })
    picture: string;

    @ManyToOne(() => Project, project => project.categories)
    @JoinColumn({ name: "projectId" })
    project: Project;

    @Column({ type: 'text'})
    description: string;

    @OneToMany(() => UserMission, userMission => userMission.mission)
    userMission: UserMission[];
}