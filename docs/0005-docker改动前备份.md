# docker改动前信息备份

vichel@hp-server:~$ docker ps
CONTAINER ID   IMAGE            COMMAND                  CREATED       STATUS                 PORTS                                                    NAMES
aad0888eb018   kyl:local        "java -jar /app/bin/…"   10 days ago   Up 10 days             0.0.0.0:8020->8020/tcp, [::]:8020->8020/tcp              kyl
e55517045f81   redis:7-alpine   "docker-entrypoint.s…"   2 weeks ago   Up 2 weeks             0.0.0.0:6379->6379/tcp, [::]:6379->6379/tcp              kyl-redis
0a6c5185a75d   mysql:8.0        "docker-entrypoint.s…"   2 weeks ago   Up 2 weeks (healthy)   0.0.0.0:3306->3306/tcp, [::]:3306->3306/tcp, 33060/tcp   kyl-mysql