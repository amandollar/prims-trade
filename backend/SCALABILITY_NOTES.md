# Scalability Notes

## Horizontal Scaling

- **API Gateway:** Run multiple instances behind a load balancer (e.g. nginx, AWS ALB). No local state; rate limiting should use a shared store (e.g. Redis) when scaling horizontally.
- **Auth / User / Trade Signal services:** Stateless; run N instances each. Use the same `JWT_SECRET` across all instances so tokens work everywhere.
- **MongoDB:** Use replica sets for read scaling; sharding when write volume grows.
- **Load balancer:** Point clients to the LB; LB forwards to gateway instances. Sticky sessions not required for JWT-based auth.

## Redis Caching

- **Placement:** Trade signal service (and optionally User service) can use Redis for GET responses.
- **Use cases:**
  - Cache `GET /trade-signals` per user (key e.g. `trade-signals:user:{userId}`), invalidate on create/update/delete for that user.
  - Cache `GET /trade-signals/:id` (key e.g. `trade-signal:{id}`), invalidate on update/delete.
  - Admin "all tasks" list: key `trade-signals:admin:all`; public approved: `trade-signals:public:approved`.
- **TTL:** e.g. 5–15 minutes; shorten if data must be fresher.
- **Implementation:** `shared` already defines `ICacheService`; implement a Redis client (e.g. ioredis) when `REDIS_ENABLED=true` and wire it in the trade-signal (and user) service.

## Message Queues (Kafka-Ready Design)

- **Current design:** Services are called via HTTP from the gateway. No queue yet.
- **To introduce Kafka (or similar):**
  - **Events:** e.g. `user.registered`, `trade_signal.created`, `trade_signal.updated`, `trade_signal.status_changed`. Producers: auth-service, trade-signal-service. Consumers: trade-signal-service (cache invalidation), analytics, notifications.
  - **Abstraction:** Add a small `EventPublisher` / `EventConsumer` in shared or per service. Same interface; swap implementation from "sync HTTP" to "publish to Kafka". Keeps controllers unchanged.
  - **Use cases:** Async signup emails, cache invalidation across instances, audit logs, future new services subscribing to events.

## Splitting Into Independently Deployable Services

- Each app (`api-gateway`, `auth-service`, `user-service`, `trade-signal-service`) already has its own `src/`, routes, and config.
- **Deploy:** Build and deploy each service's Docker image separately. No need to deploy all at once.
- **DB:** Today all use one MongoDB. For full isolation, give each service its own DB (or schema) and communicate via APIs or events (e.g. auth-service owns users; user-service calls auth or subscribes to `user.registered`).
- **Config:** Use env vars (or a secret manager) per deployment so each service gets its own `MONGODB_URI`, `REDIS_URL`, `JWT_SECRET`, and service URLs.

## Load Balancer Setup

- Put the **API Gateway** behind the load balancer. Clients hit the LB; LB forwards to gateway instances.
- Health: Expose `GET /health` on the gateway; LB uses it for health checks.
- No session affinity needed if using JWT in `Authorization` header.
- Optional: TLS termination at the LB.

## JWT Strategy for Distributed Systems

- **Shared secret:** All services that verify JWTs (gateway optional; auth/user/trade-signal if they verify) must use the same `JWT_SECRET`. Store in a secret manager and inject via env.
- **Stateless:** No server-side session; scale any service horizontally.
- **Short-lived access tokens:** e.g. 15 min; refresh token (e.g. 7 days) for getting new access tokens without re-login.
- **Revocation:** For logout/revocation, use a blocklist (e.g. Redis) of revoked token IDs (jti) or refresh tokens until they expire; check in auth middleware when `REDIS_ENABLED` is true.
