DOCKER = docker compose
YML_ROUTE = ./docker-compose.yml

all: $(shell mkdir -p uploads && mkdir -p database)
	$(DOCKER) -f $(YML_ROUTE) up -d --build

down:
	$(DOCKER) -f $(YML_ROUTE) down