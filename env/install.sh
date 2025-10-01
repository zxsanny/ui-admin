cd /etc/nginx/sites-available

tee -a admin.azaion.com << END
server {
    listen 80;
    server_name admin.azaion.com;
    
    location / {
        proxy_pass http://localhost:4005;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
END

ln -s /etc/nginx/sites-available/admin.azaion.com /etc/nginx/sites-enabled/
certbot --nginx -d admin.azaion.com

nginx -t

