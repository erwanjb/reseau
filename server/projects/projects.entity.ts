import {
    BaseEntity,
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    ManyToMany,
    JoinTable,
    OneToMany,
    AfterLoad
} from "typeorm";
import { StatusEnum } from "./enums/statusEnum";
import { UserProject } from "./usersProjects.entity";
import { Category } from "./categories.entity";
import { Mission } from "./mission.entity"

@Entity()
export class Project extends BaseEntity {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    title: string;

    @Column({ type: "enum", enum: StatusEnum })
    status: StatusEnum;

    @Column({ nullable: true })
    picture?: string;

    @Column({ type: 'text'})
    description: string;

    @OneToMany(() => UserProject, userProject => userProject.project)
    userProject: UserProject[];

    @OneToMany(() => Mission, mission => mission.project)
    missions: Mission[];

    @OneToMany(() => Category, category => category.project)
    categories: Category[];
}