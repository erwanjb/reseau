import {
    BaseEntity,
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    ManyToMany,
    JoinTable,
    OneToMany,
    AfterLoad, 
    Check
} from "typeorm";
import { StatusEnum } from "./enums/statusEnum";
import { UserProject } from "./usersProjects.entity";
import { Category } from "./categories.entity";
import { Mission } from "./mission.entity"

@Entity()
@Check(`0 <= "time" AND "time" <= 100`)
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

    @Column({ type: 'integer', })
    time: number

    @OneToMany(() => UserProject, userProject => userProject.project)
    userProject: UserProject[];

    @OneToMany(() => Mission, mission => mission.project)
    missions: Mission[];

    @OneToMany(() => Category, category => category.project)
    categories: Category[];
}