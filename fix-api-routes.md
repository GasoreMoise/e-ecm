# Fix for API Routes

Replace all instances of:

```js
export const dynamic = 'force-dynamic'
```

With:

```js
export const config = {
  runtime: 'nodejs',
  regions: ['fra1'],
  dynamic: 'force-dynamic'
};
```

## Files to check:

1. src/app/api/user/profile/route.ts
2. src/app/api/user/mock-profile/route.ts
3. src/app/api/auth/mock-login/route.ts
4. src/app/api/auth/verify/route.ts
5. src/app/api/auth/login/route.ts
6. src/app/api/auth/logout/route.ts
7. src/app/api/healthcheck/route.ts
8. src/app/api/dashboard/buyer/route.ts

Be sure to check if any of these files have `'use server'` directive at the top. 