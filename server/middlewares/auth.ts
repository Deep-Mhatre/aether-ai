import {Request, Response, NextFunction} from 'express'
import { auth } from '../lib/auth.js'
import { fromNodeHeaders } from 'better-auth/node'
import { verifyToken } from '@clerk/backend'

const getCookieValue = (cookieHeader: string | undefined, key: string) => {
    if (!cookieHeader) return undefined;
    const match = cookieHeader
        .split(';')
        .map((part) => part.trim())
        .find((part) => part.startsWith(`${key}=`));
    return match ? decodeURIComponent(match.slice(key.length + 1)) : undefined;
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const bearerToken = req.headers.authorization?.startsWith('Bearer ')
            ? req.headers.authorization.slice(7)
            : undefined;
        const clerkSessionToken = getCookieValue(req.headers.cookie, '__session');
        const clerkToken = bearerToken || clerkSessionToken;

        if (clerkToken && !process.env.CLERK_SECRET_KEY) {
            return res.status(401).json({ message: 'Missing CLERK_SECRET_KEY for Clerk token verification' });
        }

        if (clerkToken && process.env.CLERK_SECRET_KEY) {
            const payload = await verifyToken(clerkToken, {
                secretKey: process.env.CLERK_SECRET_KEY
            });

            const clerkUserId = payload.sub;
            if (!clerkUserId) {
                return res.status(401).json({ message: 'Unauthorized user' });
            }

            req.userId = clerkUserId;
            return next();
        }

        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers)
        })

        if(!session || !session?.user){
            return res.status(401).json({ message: 'Unauthorized user'})
        }

        req.userId = session.user.id;

        next()
    } catch (error: any) {
        console.log(error);
        res.status(401).json({ message: error.code || error.message });
    }
}
