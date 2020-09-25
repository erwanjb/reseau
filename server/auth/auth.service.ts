import { Injectable, NotFoundException, forwardRef, Inject } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { ProjectsService } from '../projects/projects.service';
import shA256  from "crypto-js/sha256";
import { JwtService } from '@nestjs/jwt';
import { StatusEnum } from "../users/enums/statusEnum";
import { Response } from "express";
import { User } from "../users/users.entity";
import transport from "../config/nodemailer.config";
import crypto from "crypto-js";

@Injectable()
export class AuthService {
    constructor(
        private projectsService: ProjectsService,
        private usersService: UsersService,
        private jwtService: JwtService
        ) {}

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findByEmail(username);
        if (user && user.password === shA256(pass, process.env.AUTH_SECRET).toString()) {
            const { password, status, ...result } = user;
            if (status === StatusEnum.ENABLED) {
                return result;
            }
            return null;
        }
        return null;
    }

    async login(user: User) {
        const { password, status,  ...payload } = { ...user };
        return {
            token: this.jwtService.sign(payload),
        };
    }

    async confirmToken(token: string, res: Response) {
        const { password, status, ...payload } = await this.usersService.findByToken(token);
        await this.usersService.enabled(payload.id);
        res.redirect(process.env.CLIENT_URL);
    }

    async sendResetPassword (email: string) {
        const user = await this.usersService.findByEmailEnabled(email);

        let confirmToken;
        let verifyToken;

        do {
            confirmToken = crypto.lib.WordArray.random(16).toString();
            verifyToken = await this.usersService.verifyToken(confirmToken);
        } while (verifyToken);

        user.confirmToken = confirmToken;
        user.save()
        
        await transport.sendMail({
            from: 'ne-pas-repondre@reseau.fr',
            to: email,
            subject: 'refaire le mot de passe',
            html: `Si vous voulez changer votre mot de passe sur le réseau, clickez sur le lien <a href="${process.env.CLIENT_URL}/resetPassword/${user.id}/${confirmToken}">ICI</a>`
        });

        return 'Email envoyé';
    }

    async resetPassword (userId: string, token: string, password: string) {
        const user = await this.usersService.findByIdResetPassword(userId, token);
        
        user.password = shA256(password, process.env.AUTH_SECRET).toString();
        user.confirmToken = null;
        user.save();
        
        return 'Mot de passe changé';
    }
}
