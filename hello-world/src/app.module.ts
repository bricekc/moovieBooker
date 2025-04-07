import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';

//https://docs.nestjs.com/techniques/database
@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'moovieBooker',
      autoLoadEntities: true,
      synchronize: true,
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AppModule {}
