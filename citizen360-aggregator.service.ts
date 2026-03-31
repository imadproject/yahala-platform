import { Module } from '@nestjs/common';
import { Citizen360Controller } from './citizen360.controller';
import { Citizen360Service } from './citizen360.service';

@Module({ controllers: [Citizen360Controller], providers: [Citizen360Service], exports: [Citizen360Service] })
export class Citizen360Module {}
