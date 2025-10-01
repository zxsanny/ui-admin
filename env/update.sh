docker stop ui-admin
docker rm ui-admin
docker login docker.azaion.com
docker pull docker.azaion.com/ui-admin:latest
docker run -p 4005:3000 \
          --name ui-admin --restart always docker.azaion.com/ui-admin
