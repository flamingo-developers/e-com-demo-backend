import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RouterModule } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { CustomerModule } from './customer/customer.module';
import { ImagesModule } from './images/images.module';
import { ProductsModule } from './products/products.module';
import AuthMiddleWare from './shared/middlewares/auth.middleware';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const DB_NAME = config.get('DATABASE_NAME');
        return {
          autoIndex: true,
          uri: `mongodb://localhost/${DB_NAME}`,
        };
      },
    }),
    CustomerModule,
    AuthModule,
    CategoryModule,
    ProductsModule,
    ImagesModule,
    RouterModule.register([
      { path: 'users', module: CustomerModule },
      { path: 'auth', module: AuthModule },
      { path: 'categories', module: CategoryModule },
      { path: 'products', module: ProductsModule },
      { path: 'images', module: ImagesModule },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleWare)
      .exclude({ path: 'users', method: RequestMethod.POST })
      .forRoutes('v1');
  }
}
