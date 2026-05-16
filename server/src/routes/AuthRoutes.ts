import { Router, type Request, type Response } from 'express';
import passport from 'passport';
import AdminModel from '../model/AdminSchema.js';
import Config from '../Config.js';
import AuthService from '../service/AuthService.js';

const router = Router();

const authService = new AuthService();

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  }),
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
  }),
  async (req: Request, res: Response) => {
    try {
      const googleUser = req.user as any;

      const name = googleUser.displayName || `${googleUser.name?.givenName} ${googleUser.name?.familyName}`;

      const email = googleUser.emails?.[0]?.value;

      const profileUrl = googleUser.photos?.[0]?.value;

      const admin = await AdminModel.findOne({ email });

      if (!admin || !admin.isActive) {
        return res.redirect(`${Config.frontendUrl}/unauthorized`);
      }

      const accessToken = authService.generateAccessToken(admin.id, admin.email, admin.isActive);

      const refreshToken = authService.generateRefreshToken(admin.email);

      await authService.syncAdminProfile(email, profileUrl, refreshToken, name);

      res.cookie('accessToken', accessToken, authService.getCookieOptions('access'));

      res.cookie('refreshToken', refreshToken, authService.getCookieOptions('refresh'));

      return res.redirect(`${Config.frontendUrl}/admin`);
    } catch {
      return res.redirect(`${Config.frontendUrl}/login?error=auth_failed`);
    }
  },
);

router.post('/refresh', async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      throw new Error('No refresh token');
    }

    const newAccessToken = await authService.refreshAccessToken(refreshToken);

    res.cookie('accessToken', newAccessToken, authService.getCookieOptions('access'));

    return res.status(200).json({
      success: true,
    });
  } catch {
    res.clearCookie('accessToken', authService.getCookieOptions('access'));

    res.clearCookie('refreshToken', authService.getCookieOptions('refresh'));

    return res.status(401).json({
      message: 'Session expired',
    });
  }
});

router.post('/logout', async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  if (refreshToken) {
    await AdminModel.findOneAndUpdate(
      { refreshToken },
      {
        $set: {
          refreshToken: null,
        },
      },
    );
  }

  res.clearCookie('accessToken', authService.getCookieOptions('access'));

  res.clearCookie('refreshToken', authService.getCookieOptions('refresh'));

  return res.status(200).json({
    success: true,
  });
});

export default router;
