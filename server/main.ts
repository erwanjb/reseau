import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import cors from "cors";

declare const module: any;

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.use(cors({
      origin: process.env.CLIENT_URL
    }))
    await app.listen(3000);

    if (module.hot) {
        module.hot.accept();
        module.hot.dispose(() => app.close());
      }
}

bootstrap();
