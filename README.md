# Polis DigiFinland Tools

## Description
Set of deploy scripts, settings files, custom patches, translations and utilities for running Polis experiment deployments for DigiFinland.

## Initialization


1. Clone this repository.

    ```
    git clone git@github.com:polis-digifinland-tools/polis-digifinland-tools.git
    ```

    Optionally, set autocrlf if you encounter issues with line endings:

    ```
    git config --global core.autocrlf true
    ```

2. Add `polis.local` entry to your local DNS or hosts file:
    ```
    127.0.0.1 	polis.local
    ```

4. Copy `digifinland-example.env` to a new file called `.env` and edit variables to match your environment.

## Quickstart to get local environment up with Docker Compose

1. Patch Polis codebase:
    ```
    ./scripts/patch-polis-codebase.sh
    ```
2. Edit env variables in `digifinland-dev.env` file.

3. Build and start containers with Docker Compose:
    ```
    docker-compose up -d --force-recreate --build --remove-orphans
    ```
4. Browse to https://polis.local


# Database setup

## Container

Docker Compose deployment uses Postgres service defined in `docker-compose-digifinland.yml`. Default database initialization & migration SQL scripts are run on the first startup. 

## Database on host for minikube (optional)

If you like to use minikube and skaffold for testing Kubernetes deployment locally, either install database on your host or create a new StatefulSet deployment running database container based on `polis/server/Dockerfile-db`.
To use database from host, install Postgres 13.7 and use a suitable test DB dump. Note that newer Postgres versions are not supported by Polis yet.
Example configurations assume that database service is running at `host.docker.internal:5432`.

# Patching Polis codebase

To patch Polis submodule with DigiFinland customizations and settings, run patch script before building images or running docker compose.

This fetches latest working Polis version from `origin/edge` branch and adds custom configs and patches. 

```
./scripts/patch-polis-codebase.sh
```

# Docker Compose

## Setup nginx as local loadbalancer (optional)

By default, configuration uses nginx container in a way it is used in the original codebase.

You can also use nginx on your host and setup load balancing proxy with example site configurations provided in the `nginx` directory.

## Run dev env with Docker Compose

After patching, build and start all containers.
Script takes env identifier (dev) as argument. 

```
./scripts/docker-compose_build-and-deploy.sh dev
```

## Stop and remove containers

Takes env identifier (dev) as argument. 
```
./scripts/docker-compose_stop.sh dev
```

# Minikube & Skaffold

Kubernetes configuration files are in `./manifests` directory.
See skaffold.yaml for artifacts and build config.

Starts local Minikube cluster with metrics and ingress addons, and starts ingress tunnel:
```
./scripts/k8s_start-local-minikube.sh
```

Builds and deploys containers using Skaffold:
```
skaffold run
```

Alternatively, to use image pruning, you can run:
```
skaffold dev --no-prune=false --cache-artifacts=false
```

# Building and pushing images

Builds and pushes images to artifact registry.

Example:
```
./scripts/docker_images-build-and-push.sh example.com/project/repository tag-name
```

### Licensing
See [LICENSE](./LICENSE.md)

### Contributing changes
* See [CONTRIBUTING.md](docs/CONTRIBUTING.md)

### Additional documents in /docs
* [CODE_OF_CONDUCT](docs/CODE_OF_CONDUCT.md)
* [SECURITY](docs/SECURITY.md)
* [SUPPORT](docs/SUPPORT.md)
