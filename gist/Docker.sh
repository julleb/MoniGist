#!/bin/bash

# exit upon error
set -e

# First cli args
timeout=$1

# Shift all the cli args <---
shift

# Send another process (detached) with the rest of the args
cont=$(docker run -d "$@")
# Wait for timeout or process finished
code=$(timeout "$timeout" docker wait "$cont" || true)
# Kill docker if its finished or not
docker kill $cont &> /dev/null


# echo -n "status: "
if [ -z "$code" ]; then
    echo "timeout"
else
    echo "$code" | sed '1d'
fi

# echo "output: "
docker logs $cont # | sed 's/^/\t/'
docker rm $cont &> /dev/null




