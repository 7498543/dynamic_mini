import {
  createRouter,
  defineEventHandler,
  readValidatedBody,
  useBase,
} from 'h3';
import { z } from 'zod';

const router = createRouter();

const loginSchema = z.object({
  username: z.string().trim().min(3).max(20),
  password: z.string().trim().min(6).max(20),
});

const registerSchema = z
  .object({
    username: z.string().trim().min(3).max(20),
    password: z.string().trim().min(6).max(20),
    confirmPassword: z.string().trim().min(6).max(20),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
  });

router.post(
  '/login',
  defineEventHandler(async (event) => {
    const loginData = await readValidatedBody(event, loginSchema.safeParse);
    if (!loginData.success) {
      return badRequestResponse(event, 'Invalid login data');
    }
    const { username, password } = loginData.data;
    const db = getDB();

    const user = await db.query.sysUserSchema.findFirst({
      where: {
        username,
        enabled: true,
        deletedAt: null,
      },
    });

    if (!user) {
      return notAuthorizedResponse(event, 'Invalid username or password');
    }

    const valid = await verifyPassword(password, user.password);

    if (!valid) {
      return notAuthorizedResponse(event, 'Invalid username or password');
    }

    const token = generateRandomToken();
    const loginStore = await useStorage('login');
    await loginStore.set(token, {
      userId: user.id,
      username: user.username,
      nickname: user.nickname,
      timestamp: Date.now(),
    });

    return successResponse(
      event,
      {
        username: user.username,
        nickname: user.nickname,
        token,
      },
      'Login successful'
    );
  })
);

router.post(
  '/register',
  defineEventHandler(async (event) => {
    const registerData = await readValidatedBody(
      event,
      registerSchema.safeParse
    );
    if (!registerData.success) {
      return badRequestResponse(event, 'Invalid register data');
    }
    const { username, password } = registerData.data;
    const db = getDB();
    const user = await db.query.sysUserSchema.findFirst({
      where: {
        username,
      },
    });
    if (user) {
      return badRequestResponse(event, 'Username already exists');
    }
    const hashedPassword = await hashPassword(password);
    await db.query.sysUserSchema.insert({
      data: {
        username,
        password: hashedPassword,
        nickname: username,
        enabled: true,
      },
    });
    return successResponse(event, { username }, 'Register successful');
  })
);

router.post(
  '/logout',
  defineEventHandler(async (event) => {
    const token = event.headers.get('Authorization')?.replace('Bearer ', '');
    if (token) {
      const loginStore = await useStorage('login');
      await loginStore.remove(token);
    }
    return successResponse(event, null, 'Logout successful');
  })
);

export default useBase('/api/wwws/auth', router.handler);
