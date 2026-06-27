# ConectaPueblos — Phase 1 Summary

## 1. Project overview

ConectaPueblos is a community-focused social web platform designed to connect villages, people, local activities, and community conversations. The product experience is built around discovering villages, joining activities, reading and sharing local posts, exploring profiles, and feeling part of a living rural community.

The Phase 1 frontend establishes ConectaPueblos as a warm, modern, rural/community social network. It is currently frontend-only and uses local mock data while remaining prepared for a future FastAPI backend.

## 2. Current public URL

https://conecta-pueblos.vercel.app

## 3. Tech stack used in Phase 1

- Next.js App Router
- TypeScript
- TailwindCSS
- Local mock data
- Client-side interactions with `useState` and `localStorage`
- Vercel deployment

## 4. Phase 1 completed scope

### Phase 1.0 — Initial frontend MVP

- Frontend project created from scratch.
- Main application routes created.
- Initial warm, rural, community-oriented visual design implemented.
- Local mock data added for villages, activities, and community posts.

### Phase 1.1 — API-ready frontend structure

- `lib/api/` layer prepared.
- Services created for villages, activities, community, and auth.
- Data still comes from local mocks.
- Structure prepared to replace mock data with FastAPI responses later.

### Phase 1.2 — Social app experience

- Social layout created with navbar, sidebar, right rail, and mobile bottom navigation.
- Community feed improved with a more visual social experience.
- Dashboard redesigned as a social home for the user.
- Profile page redesigned with a social profile appearance.
- Villages and activities redesigned with a stronger discovery-oriented experience.

### Phase 1.3 — Demo-ready interactions

- Real client-side filters added.
- Mock likes persisted with `localStorage`.
- Mock saved states persisted with `localStorage`.
- Activity join state handled locally.
- Village follow state handled locally.
- Future mock routes created:
  - `/explore`
  - `/notifications`
  - `/messages`
  - `/settings`

### Phase 1.4 — Visual polish

- Responsive layout polished.
- UX copy improved.
- Metadata improved.
- Mock visual states added with `LoadingState`, `ErrorState`, and `EmptyState`.
- Mobile bottom navigation spacing and usability improved.
- Landing page clarified as a rural community social network.

### Phase 1.5 — Vercel deployment

- Deployment completed on Vercel.
- Mobile verification completed.
- Public URL is active.

## 5. Main routes

- `/`
- `/login`
- `/register`
- `/dashboard`
- `/community`
- `/activities`
- `/activities/[id]`
- `/activities/create`
- `/villages`
- `/villages/[id]`
- `/profile`
- `/admin`
- `/explore`
- `/notifications`
- `/messages`
- `/settings`

## 6. Main folders

- `app/` — Next.js App Router pages and route segments.
- `components/` — Shared UI, layout, and social components.
- `features/` — Feature-specific components for activities, villages, and community.
- `data/` — Local mock data used during Phase 1.
- `lib/` — Shared types, utilities, and application helpers.
- `lib/api/` — API-ready service layer currently backed by local mock data.

## 7. Important components created

- `mobile-bottom-nav.tsx`
- `social-layout.tsx`
- `sidebar-nav.tsx`
- `right-rail.tsx`
- `navbar.tsx`
- `page-header.tsx`
- `search-input.tsx`
- `notification-bell.tsx`
- `loading-state.tsx`
- `error-state.tsx`
- `future-page.tsx`
- `follow-button.tsx`
- `join-activity-button.tsx`
- `save-button.tsx`
- `social-post-actions.tsx`
- `social-post-card.tsx`
- `activity-card.tsx`
- `village-card.tsx`

## 8. Mock data

There is no real backend yet. Phase 1 uses local mock data from:

- `data/villages.ts`
- `data/activities.ts`
- `data/community.ts`

The `lib/api/*` services act as an intermediate layer between the UI and the current mock data. This keeps the frontend prepared for a future FastAPI integration: when the backend is ready, the mock-backed service functions can be replaced gradually with real API calls without rewriting the UI screens.

## 9. Validation status

- `npm run lint` passes.
- `npm run build` passes.
- Vercel deployment is working correctly.
- Mobile verification is complete.

## 10. Current limitations

- There is no real backend.
- There is no real authentication.
- There is no database.
- Likes, saved states, follows, and activity signups are mock interactions stored locally with `localStorage`.
- There is no real image upload.
- Messages and notifications are not real yet.

## 11. Recommended Phase 2 roadmap

### Phase 2.0 — FastAPI backend base

- Create a `backend/` folder.
- Configure FastAPI.
- Configure CORS.
- Create a health check endpoint.
- Establish a clean backend project structure.

### Phase 2.1 — PostgreSQL Neon + SQLAlchemy + Alembic

- Connect PostgreSQL Neon.
- Create initial database models.
- Configure Alembic migrations.

### Phase 2.2 — Authentication

- Implement registration.
- Implement login.
- Add JWT authentication.
- Add `/auth/me`.

### Phase 2.3 — Core API resources

- Villages.
- Activities.
- Community posts.
- Users.

### Phase 2.4 — Social interactions

- Likes.
- Saved posts.
- Follows.
- Activity participants.

### Phase 2.5 — Frontend integration

- Gradually replace mock data using `lib/api/*`.
- Keep mock data fallback if useful during transition.

## 12. Next immediate step

The recommended next step is to create the base FastAPI backend first, without connecting every frontend screen at once. Start with project structure, CORS, a health check endpoint, environment configuration, and database setup. Once the backend foundation is stable, replace the mock-backed `lib/api/*` services gradually.
