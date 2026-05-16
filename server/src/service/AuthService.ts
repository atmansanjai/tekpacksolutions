import type { CookieOptions } from 'express';
import Config from '../Config.js';
import jwt, { type Secret } from 'jsonwebtoken';
import AdminModel from '../model/AdminSchema.js';

class AuthService {
  public getCookieOptions(type: 'access' | 'refresh'): CookieOptions {
    const isProd = Config.nodeEnv === 'production';

    return {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'strict' : 'lax',
      path: type === 'refresh' ? '/api/auth/refresh' : '/',
      maxAge: type === 'access' ? 2 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000,
    };
  }

  public generateAccessToken(id: string, adminEmail: string, isActive: boolean) {
    return jwt.sign(
      {
        id,
        adminEmail,
        isActive,
      },
      Config.jwt.accessSecret as Secret,
      {
        expiresIn: Config.jwt.accessExpiry as any,
      },
    );
  }

  public generateRefreshToken(adminEmail: string) {
    return jwt.sign({ adminEmail }, Config.jwt.refreshSecret as Secret, {
      expiresIn: Config.jwt.refreshExpiry as any,
    });
  }

  public async refreshAccessToken(token: string) {
    try {
      const decoded = jwt.verify(token, Config.jwt.refreshSecret as Secret) as { adminEmail: string };

      const admin = await AdminModel.findOne({
        email: decoded.adminEmail,
        refreshToken: token,
      });

      if (!admin || !admin.isActive) {
        throw new Error('Invalid session');
      }

      return this.generateAccessToken(admin.id, admin.email, admin.isActive);
    } catch {
      throw new Error('Session expired');
    }
  }

  public async syncAdminProfile(email: string, profileUrl: string, refreshToken: string, name: string) {
    return await AdminModel.findOneAndUpdate(
      { email },
      {
        $set: {
          profileUrl,
          refreshToken,
          name,
        },
      },
      { new: true },
    );
  }

  public VerifyToken(token: string) {
    try {
      return jwt.verify(token, Config.jwt.accessSecret as Secret) as {
        id: string;
        adminEmail: string;
        isActive: boolean;
      };
    } catch {
      return null;
    }
  }
}

export default AuthService;
