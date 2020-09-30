import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import cors from "cors";
import express from "express";
import history from 'connect-history-api-fallback';

declare const module: any;

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    if (process.env.NODE_ENV === "development") {
      app.use(cors({
        origin: process.env.CLIENT_URL
      }));
    }

    if (process.env.NODE_ENV === "production") {
      app.use(history({
        exclusions: ['/auth/confirmToken/me/token']
      }));
      app.use('/', express.static('dist-react'));

      if (process.env.CLIENT_URL_SECONDE) {
        app.use(cors({
          origin: process.env.CLIENT_URL_SECONDE
        }));
      }
    }

    await app.listen(process.env.NODE_ENV === "production" ? 80 : 3000);

    if (module.hot) {
        module.hot.accept();
        module.hot.dispose(() => app.close());
      }
}

bootstrap();
