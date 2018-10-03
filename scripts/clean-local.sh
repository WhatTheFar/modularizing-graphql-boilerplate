echo '# stop and remove running container'
docker stop $(docker ps -q)
docker rm $(docker ps -aq)
docker-compose down
echo '# removing backend dependencies'
rm -rf ./node_modules
echo '# removing images'
docker image prune -f
docker rmi graphql-backend
docker rmi graphql-backend-dev
echo '# removing volume(s)'
docker volume prune -f