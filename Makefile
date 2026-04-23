# ═══════════════════════════════════════════════════════════════════════════════
#  Skydecor – Docker Makefile
#
#  Usage:  make <target>
#  List:   make help
# ═══════════════════════════════════════════════════════════════════════════════

DEV_FILE  := docker-compose.dev.yml
PROD_FILE := docker-compose.prod.yml

.DEFAULT_GOAL := help

# ── Help ───────────────────────────────────────────────────────────────────────
.PHONY: help
help:
	@echo ""
	@echo "  Skydecor Docker Commands"
	@echo "  ────────────────────────────────────────────────────────────────"
	@echo "  Development"
	@echo "    make dev            Build images and start all dev services"
	@echo "    make dev-up         Start dev services (no rebuild)"
	@echo "    make dev-down       Stop dev services"
	@echo "    make dev-down-v     Stop dev services and remove volumes"
	@echo "    make dev-build      Rebuild dev images without starting"
	@echo "    make dev-logs       Tail logs for all dev services"
	@echo "    make dev-ps         Show running dev containers"
	@echo ""
	@echo "  Production"
	@echo "    make prod           Build images and start all prod services (detached)"
	@echo "    make prod-up        Start prod services (no rebuild, detached)"
	@echo "    make prod-down      Stop prod services"
	@echo "    make prod-build     Rebuild prod images without starting"
	@echo "    make prod-logs      Tail logs for all prod services"
	@echo "    make prod-ps        Show running prod containers"
	@echo ""
	@echo "  Individual image builds"
	@echo "    make build-backend-dev   Build backend dev image"
	@echo "    make build-backend-prod  Build backend prod image"
	@echo "    make build-frontend-dev  Build frontend dev image"
	@echo "    make build-frontend-prod Build frontend prod image"
	@echo ""
	@echo "  Shell access (dev containers must be running)"
	@echo "    make shell-backend  Open shell in dev backend container"
	@echo "    make shell-frontend Open shell in dev frontend container"
	@echo "    make shell-mongo    Open mongosh in dev mongo container"
	@echo ""
	@echo "  Cleanup"
	@echo "    make clean          Remove stopped containers and dangling images"
	@echo "    make clean-all      Full prune: containers, images, volumes, cache"
	@echo "  ────────────────────────────────────────────────────────────────"
	@echo ""

# ── Development ────────────────────────────────────────────────────────────────
.PHONY: dev
dev:
	docker compose -f $(DEV_FILE) up --build

.PHONY: dev-up
dev-up:
	docker compose -f docker-compose.dev.yml up -d

.PHONY: dev-down
dev-down:
	docker compose -f $(DEV_FILE) down

.PHONY: dev-down-v
dev-down-v:
	docker compose -f $(DEV_FILE) down -v

.PHONY: dev-build
dev-build:
	docker compose -f $(DEV_FILE) build

.PHONY: dev-logs
dev-logs:
	docker compose -f $(DEV_FILE) logs -f

.PHONY: dev-ps
dev-ps:
	docker compose -f $(DEV_FILE) ps

# ── Production ─────────────────────────────────────────────────────────────────
.PHONY: prod
prod:
	docker compose -f $(PROD_FILE) up --build -d

.PHONY: prod-up
prod-up:
	docker compose -f $(PROD_FILE) up 

.PHONY: prod-down
prod-down:
	docker compose -f $(PROD_FILE) down

.PHONY: prod-build
prod-build:
	docker compose -f $(PROD_FILE) build

.PHONY: prod-logs
prod-logs:
	docker compose -f $(PROD_FILE) logs -f

.PHONY: prod-ps
prod-ps:
	docker compose -f $(PROD_FILE) ps

# ── Individual image builds ────────────────────────────────────────────────────
.PHONY: build-backend-dev
build-backend-dev:
	docker build --target development -t skydecor-backend:dev ./backend

.PHONY: build-backend-prod
build-backend-prod:
	docker build --target production -t skydecor-backend:prod ./backend

.PHONY: build-frontend-dev
build-frontend-dev:
	docker build --target development -t skydecor-frontend:dev ./frontend

.PHONY: build-frontend-prod
build-frontend-prod:
	docker build --target production -t skydecor-frontend:prod ./frontend

# ── Shell access ───────────────────────────────────────────────────────────────
.PHONY: shell-backend
shell-backend:
	docker exec -it skydecor-backend-dev sh

.PHONY: shell-frontend
shell-frontend:
	docker exec -it skydecor-frontend-dev sh

.PHONY: shell-mongo
shell-mongo:
	docker exec -it skydecor-mongo-dev mongosh -u admin -p secret --authenticationDatabase admin

# ── Cleanup ────────────────────────────────────────────────────────────────────
.PHONY: clean
clean:
	docker container prune -f
	docker image prune -f

.PHONY: clean-all
clean-all:
	docker system prune -af --volumes
