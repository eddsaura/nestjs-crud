import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: AuthDto) {
    //generate the password hash
    const passwordHash = await argon.hash(dto.password);
    // save the new user in the db

    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash: passwordHash,
        },
      });

      return this.signToken(user.id, user.email);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Error creating user');
        }
      }
      throw error;
    }
  }

  async signin(dto: AuthDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        email: dto.email,
      },
    });

    if (!user) {
      throw new ForbiddenException('Invalid credentials');
    }

    const passwordMatch = await argon.verify(user.hash, dto.password);

    if (!passwordMatch) {
      throw new ForbiddenException('Invalid credentials');
    }

    return this.signToken(user.id, user.email);
  }

  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const token = await this.jwt.signAsync(
      {
        sub: userId,
        email,
      },
      {
        expiresIn: '15m',
        secret: this.config.get('JWT_SECRET'),
      },
    );
    return {
      access_token: token,
    };
  }
}
