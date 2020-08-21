import { Controller, Request, Response, Get, Query, Post, UseGuards, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}
    
    @UseGuards(AuthGuard('local'))
    @Post('login')
    login(@Request() req) {
        return this.authService.login(req.user);
    }

    @Get('/confirmToken')
    confirmToken(@Query('token') token, @Response() res) {
        return this.authService.confirmToken(token, res);
    }

    @Post('/sendResetPassword')
    sendResetPassword(@Body() body) {
        return this.authService.sendResetPassword(body.email);
    }

    @Post('/resetPassword')
    resetPassword(@Body() body) {
        return this.authService.resetPassword(body.userId, body.token, body.password);
    }

}
