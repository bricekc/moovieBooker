import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { MoviesController } from './movies/movies.controller';
import { MoviesModule } from './movies/movies.module';
@Module({
  imports: [
    //https://docs.nestjs.com/techniques/configuration#use-module-globally
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    //https://docs.nestjs.com/techniques/database
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),
    UserModule,
    MoviesModule,
  ],
  controllers: [AuthController, MoviesController],
  providers: [AuthService],
})
export class AppModule {}
