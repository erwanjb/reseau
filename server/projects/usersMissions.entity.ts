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
    Transaction,
    TransactionManager,
    Check,
    AfterLoad,
    EntityManager
} from "typeorm";
import { User } from "../users/users.entity";
import { Mission } from "./mission.entity";

@Entity()
@Check(`"MyFunction" ("userId", "missionId") = 'True'`)
export class UserMission extends BaseEntity {

    @PrimaryColumn('uuid') 
    userId: string;

    @ManyToOne(() => User, user => user.missionUser) // inverse "userPlaces: UserPlace[]" is one-to-many in user
    @JoinColumn({ name: "userId" })
    user: User;

    @PrimaryColumn('uuid') 
    missionId: string;

    @ManyToOne(() => Mission, mission => mission.userMission) // inverse "userPlaces: UserPlace[]" is one-to-many in place
    @JoinColumn({ name: "missionId" })
    mission: Mission;
}