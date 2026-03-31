import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../common/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService, private readonly jwtService: JwtService) {}

  async register(dto: RegisterDto) {
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.userAccount.create({
      data: {
        nationalId: dto.nationalId,
        username: dto.nationalId,
        mobileNumber: dto.mobileNumber,
        email: dto.email,
        passwordHash,
        authStatus: 'VERIFIED',
        mfaStatus: 'OPTIONAL',
        userType: 'CITIZEN',
        defaultRoleCode: 'CITIZEN',
        citizenProfile: {
          create: {
            nationalId: dto.nationalId,
            firstNameAr: dto.fullNameAr.split(' ')[0] ?? dto.fullNameAr,
            lastNameAr: dto.fullNameAr.split(' ').slice(1).join(' ') || dto.fullNameAr,
            fullNameAr: dto.fullNameAr,
            phoneNumber: dto.mobileNumber,
            email: dto.email,
          },
        },
      },
      include: { citizenProfile: true },
    });

    return this.issueTokens(user.id, user.userType, user.citizenProfile?.id);
  }

  async login(identifier: string, password: string) {
    const user = await this.prisma.userAccount.findFirst({
      where: { OR: [{ username: identifier }, { mobileNumber: identifier }, { nationalId: identifier }] },
      include: { citizenProfile: true },
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    await this.prisma.userAccount.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
    return this.issueTokens(user.id, user.userType, user.citizenProfile?.id);
  }

  private issueTokens(userId: string, userType: string, citizenId?: string) {
    const payload = { sub: userId, userType, citizenId };
    return {
      accessToken: this.jwtService.sign(payload),
      user: payload,
    };
  }
}
