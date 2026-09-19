# Usage: ./push-docker-images.sh 0.0.1
# Set DEPLOY_HOST and REGISTRY before running.
echo "Build: $1"
echo "Starting pushing docker images..."

REGISTRY="${REGISTRY:-registry.example.com/print-commerce}"
DEPLOY_HOST="${DEPLOY_HOST:-user@your-server}"

echo "cd ~/apps/print-commerce/"
cd ~/apps/print-commerce/

echo "docker save -o ./print-commerce-server.tar $REGISTRY/server:$1"
docker save -o ./print-commerce-server.tar "$REGISTRY/server:$1"

echo "docker save -o ./print-commerce-client.tar $REGISTRY/client:$1"
docker save -o ./print-commerce-client.tar "$REGISTRY/client:$1"

echo "docker save -o ./print-commerce-admin.tar $REGISTRY/admin:$1"
docker save -o ./print-commerce-admin.tar "$REGISTRY/admin:$1"

printf "\n\n"

echo "scp print-commerce-server.tar $DEPLOY_HOST:~/"
scp print-commerce-server.tar "$DEPLOY_HOST:~/"

echo "scp print-commerce-client.tar $DEPLOY_HOST:~/"
scp print-commerce-client.tar "$DEPLOY_HOST:~/"

echo "scp print-commerce-admin.tar $DEPLOY_HOST:~/"
scp print-commerce-admin.tar "$DEPLOY_HOST:~/"

rm ./print-commerce-server.tar
rm ./print-commerce-client.tar
rm ./print-commerce-admin.tar
