import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { UserRepository } from "./users.repository";
import { User } from "./users.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { GetUsersFilterDto } from "./dto/get-users-filter.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { InsertResult, UpdateResult, DeleteResult } from "typeorm";

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
    ) {}


    async getAllUsersWithFilters(filters: GetUsersFilterDto): Promise<User[]> {
        return this.userRepository.findUsersWithFilters(filters);
    }

    async findByEmail(email: string): Promise<User> {
        const found = await this.userRepository.findOne({
            email,
        });

        if (!found) {
            throw new NotFoundException();
        }

        return found;
    }

    async findById(id: string): Promise<User> {
        const found = await this.userRepository.findOne({
            id,
        });

        if (!found) {
            throw new NotFoundException();
        }

        return found;
    }

    async create(userToCreate: CreateUserDto): Promise<InsertResult> {
        const { email } = userToCreate;

        const found = await this.userRepository.findOne({
            email,
        });

        if (found) {
            throw new ConflictException("User already exists");
        }

        return this.userRepository.createUser(userToCreate);
    }

    async updateUser(user: UpdateUserDto): Promise<UpdateResult> {
        return this.userRepository.updateUser(user);
    }


 }
