import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { StaticModule } from './common/static/static.module';
import { UserProfile } from './users/user-profile.entity';
import { User } from './users/users.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NftReward } from './nft-reward/nft-reward.entity';
import { NftRewardModule } from './nft-reward/nft-reward.module';
import { GamesModule } from './games/games.module';
import { PuzzleModule } from './puzzle/puzzle.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST'),
        port: parseInt(configService.get('DATABASE_PORT')),
        username: configService.get('DATABASE_USERNAME'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        entities: [User, UserProfile, NftReward],
        synchronize: configService.get('DATABASE_SYNC') === 'true',
        autoLoadEntities: configService.get('DATABASE_AUTOLOAD') === 'true',
        extra: {
          client_encoding: 'utf8',
        },
      }),
    }),
    UsersModule,
    AuthModule,
    StaticModule,
    NftRewardModule,
    GamesModule,
    PuzzleModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,

    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
