import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isDashboardRoute = createRouteMatcher(['/dashboard(.*)']);
const isAdminRoute = createRouteMatcher(['/admin(.*)']);
const isAuthRoute = createRouteMatcher(['sign-in', 'sign-up']);
const isPublicRoute = createRouteMatcher([
	'/',
	'/sign-in(.*)',
	'/sign-up(.*)',
	'/api/webhooks(.*)',
	'/api/uploadthing(.*)',
]);

export default clerkMiddleware((auth, req) => {
	// Restrict admin route to users with specific role
	if (isAdminRoute(req)) auth().protect({ role: 'org:admin' });

	// Restrict dashboard routes to signed in users
	if (isDashboardRoute(req)) auth().protect();

	if (!auth().userId && !isPublicRoute(req)) {
		const signInUrl = new URL('/sign-in', req.url);
		signInUrl.searchParams.set('redirect_url', req.url);
		return NextResponse.redirect(signInUrl);
	}

	if (auth().userId && isAuthRoute(req)) {
		const indexUrl = new URL('/', req.url);
		return NextResponse.redirect(indexUrl);
	}
});

export const config = {
	matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
