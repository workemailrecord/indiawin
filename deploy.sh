#!/bin/bash

# Custom script to configure Apache VirtualHost and SSL certificates
REPO_NAME=$1
DOMAIN=$2

# 1. Install Apache (if not already installed)
if ! command -v apache2 &> /dev/null
then
  echo "Apache not found. Installing..."
  sudo apt-get update
  sudo apt-get install -y apache2
fi

# 2. Create Apache VirtualHost Configuration
APACHE_CONF="/etc/apache2/sites-available/$DOMAIN.conf"

if [ ! -f "$APACHE_CONF" ]; then
  echo "Creating Apache VirtualHost configuration for $DOMAIN"

  # Create VirtualHost for the domain
  sudo bash -c "cat > $APACHE_CONF <<EOL
<VirtualHost *:80>
    ServerAdmin webmaster@$DOMAIN
    ServerName $DOMAIN
    DocumentRoot /var/www/$REPO_NAME
    ErrorLog \${APACHE_LOG_DIR}/error.log
    CustomLog \${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
EOL"

  # Enable the site and reload Apache
  sudo a2ensite $DOMAIN.conf
  sudo systemctl reload apache2
else
  echo "Apache configuration for $DOMAIN already exists."
fi

# 3. Install SSL Certificate using Let's Encrypt (Certbot)
if ! sudo certbot certificates | grep -q "$DOMAIN"; then
  echo "SSL certificate not found for $DOMAIN. Installing using Certbot..."
  
  # Install Certbot if not installed
  if ! command -v certbot &> /dev/null
  then
    echo "Certbot not found. Installing..."
    sudo apt-get update
    sudo apt-get install -y certbot python3-certbot-apache
  fi
  
  # Obtain SSL certificate
  sudo certbot --apache -d $DOMAIN --non-interactive --agree-tos --email your-email@example.com

  # Reload Apache after SSL installation
  sudo systemctl reload apache2
else
  echo "SSL certificate already installed for $DOMAIN."
fi
