#!/bin/bash
# usage: ./path_to_this_script env
#         where env is: test or dev

# build and run
DOCKER_ENV=$1 docker compose -f docker-compose-digifinland.yml  --env-file digifinland-$1.env up -d --build 

# list running containers
docker ps
