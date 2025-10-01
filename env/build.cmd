@echo off
set CURRENT_DIR=%cd%
cd /d %~dp0\..

docker build -t docker.azaion.com/ui-admin .
docker login docker.azaion.com
docker push docker.azaion.com/ui-admin

cd /d %CURRENT_DIR%
echo Done!