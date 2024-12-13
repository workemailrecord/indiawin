#!/bin/bash

# Arguments passed from GitHub Action
REPO_NAME=$1
DOMAIN=$2

# Set the hard-coded port (e.g., 3001, 3002, etc.)
PORT=3000   # You can change this as required for different websites

# Ensure Apache is installed
sudo apt update && sudo apt install -y apache2

# Enable mod_proxy and mod_proxy_http
sudo a2enmod proxy
sudo a2enmod proxy_http

# Create VirtualHost configuration for the domain and port
echo "Creating Apache VirtualHost configuration for $DOMAIN on port $PORT"
sudo bash -c "cat > /etc/apache2/sites-available/$REPO_NAME.conf <<EOF
<VirtualHost *:80>
    ServerAdmin webmaster@localhost
    DocumentRoot /var/www/$REPO_NAME
    ServerName $DOMAIN

    # Reverse Proxy settings for the hard-coded port
    ProxyPass / http://localhost:$PORT/
    ProxyPassReverse / http://localhost:$PORT/

    ErrorLog \${APACHE_LOG_DIR}/error.log
    CustomLog \${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
EOF"

# Enable the site
sudo a2ensite $REPO_NAME.conf

# Reload Apache to apply changes
sudo systemctl reload apache2


# Enable necessary ports if needed
sudo ufw allow $PORT/tcp

# Restart Apache to apply any firewall rules
sudo systemctl restart apache2
