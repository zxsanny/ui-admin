docker stop ui-admin
docker rm ui-admin

docker run -p 4005:3000 \
          --name ui-admin --restart always docker.azaion.com/ui-admin