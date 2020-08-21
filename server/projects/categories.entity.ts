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
import { UserProject } from "./usersProjects.entity";
import { Project } from "./projects.entity";

@Entity()
export class Category extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('uuid') 
    projectId: string;

    @ManyToOne(() => Project, project => project.categories)
    @JoinColumn({ name: "projectId" })
    project: Project;

    @Column()
    name: string;
}