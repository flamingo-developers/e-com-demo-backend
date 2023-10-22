import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleModule } from 'src/roles/role.module';
import { RoleRepo } from 'src/roles/role.repo';
import { Role, RoleSchema } from 'src/roles/role.schema';
import { RoleService } from 'src/roles/roles.service';
import { UserModule } from 'src/user/user.module';
import { UserRepo } from 'src/user/user.repo';
import { User, UserSchema } from 'src/user/user.schema';
import { UserService } from 'src/user/user.service';
import { SeederService } from './seeder.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const DB_URL = config.get('DATABASE_URL');
        return {
          autoIndex: true,
          uri: DB_URL,
        };
      },
    }),
    RoleModule,
    UserModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Role.name, schema: RoleSchema },
    ]),
  ],
  providers: [SeederService, UserService, UserRepo, RoleService, RoleRepo],
})
export class SeederModule {}
