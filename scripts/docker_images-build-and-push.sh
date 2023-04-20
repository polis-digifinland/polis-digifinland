#!/bin/bash
# usage: ./path_to_this_script example.com/project/repository tagname VARIABLE="build-time-variables"

# Script takes registry repository location and image tag as arguments.
# Example:
# ./scripts/docker_images-build-and-push.sh example.com/project/repository tagname VARIABLE="build-time-variables"

# before running, first authenticate and configure gcloud:
# gcloud auth login
# gcloud auth configure-docker registry-domain.example
# gcloud config set project polis-gcp-project-name-example

cd ./polis/
docker build . -f file-server/Dockerfile -t $1/polis-file-server:$2 --build-arg $3

cd ./math/
docker build . -t $1/polis-math:$2 --build-arg $3

cd ../server/
docker build . -t $1/polis-server:$2 --build-arg $3

# push images
docker push $1/polis-file-server:$2
docker push $1/polis-math:$2
docker push $1/polis-server:$2
