import { Get, Controller } from "@nestjs/common";

@Controller()
export class AppController {
    @Get()
    home() {
        return "hello";
    }
}