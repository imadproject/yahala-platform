import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CitizensModule } from './citizens/citizens.module';
import { EntitiesModule } from './entities/entities.module';
import { ServicesCatalogModule } from './services-catalog/services-catalog.module';
import { RequestsModule } from './requests/requests.module';
import { AssetsModule } from './assets/assets.module';
import { CasesModule } from './cases/cases.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { Citizen360Module } from './citizen360/citizen360.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { EnginesModule } from './common/engines/engines.module';
import { AuditModule } from './common/audit/audit.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    EnginesModule,
    AuditModule,
    AuthModule,
    CitizensModule,
    EntitiesModule,
    ServicesCatalogModule,
    RequestsModule,
    AssetsModule,
    CasesModule,
    NotificationsModule,
    AppointmentsModule,
    Citizen360Module,
  ],
})
export class AppModule {}
