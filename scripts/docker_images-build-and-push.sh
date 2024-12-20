#!/bin/bash
# usage: ./path_to_this_script example.com/project/repository tagname VARIABLE="build-time-variables" VARIABLE="build-time-variables"

# Script takes registry repository location and image tag as arguments.
# Example:
# ./scripts/docker_images-build-and-push.sh example.com/project/repository tagname VARIABLE="build-time-variables" VARIABLE="build-time-variables"

# before running, first authenticate and configure gcloud:
# gcloud auth login
# gcloud auth configure-docker registry-domain.example
# gcloud config set project polis-gcp-project-name-example



cd ./df-participation/
docker build . -f Dockerfile -t $1/df-participation:$3 --build-arg BUILD_VERSION=$3 --build-arg NEXT_PUBLIC_EXTERNAL_API_BASE_URL="https://$4" --build-arg BUILD_DATE=$(date +%d.%m.%Y) --build-arg NODE_ENV="production"
cd ./polis-digifinland/

cd ./polis/
docker build . -f file-server/Dockerfile -t $1/polis-file-server:$2 --build-arg SERVICE_URL="https://$4" --build-arg EMBED_SERVICE_HOSTNAME="$4" --build-arg NODE_ENV="production"

cd ./math/
docker build . -t $1/polis-math:$2 --build-arg SERVICE_URL="https://$4"

cd ../server/
docker build . -t $1/polis-server:$2 --build-arg SERVICE_URL="https://$4"

# push images
docker push $1/df-participation:$3
docker push $1/polis-file-server:$2
docker push $1/polis-math:$2
docker push $1/polis-server:$2
