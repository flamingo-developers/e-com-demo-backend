import { MiddlewareConsumer, Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';

import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import AuthMiddleWare from './shared/middlewares/auth.middleware';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/e-com'),
    UserModule,
    AuthModule,
    RouterModule.register([
      { path: 'users', module: UserModule },
      { path: 'auth', module: AuthModule },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleWare).forRoutes('users');
  }
}
