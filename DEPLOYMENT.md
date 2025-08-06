# Deployment Guide - Vantage Vertical

This guide covers different deployment options for the Vantage Vertical website.

## Table of Contents

1. [Production Build](#production-build)
2. [Environment Configuration](#environment-configuration)
3. [Database Setup](#database-setup)
4. [Deployment Options](#deployment-options)
5. [Monitoring and Maintenance](#monitoring-and-maintenance)

## Production Build

### Frontend Build

```bash
cd frontend
npm run build
```

This creates an optimized production build in the `frontend/build` directory.

### Backend Preparation

Ensure your backend is production-ready:
- Environment variables are properly configured
- Database connections are secure
- Error handling is implemented
- Logging is configured

## Environment Configuration

### Production Environment Variables

**Backend (.env):**
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://your-production-db-url/vantage_vertical
FRONTEND_URL=https://your-domain.com
```

**Frontend (.env):**
```env
REACT_APP_API_URL=https://your-api-domain.com/api
REACT_APP_SITE_URL=https://your-domain.com
```

## Database Setup

### MongoDB Atlas (Recommended)

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Configure network access (IP whitelist)
4. Create a database user
5. Get the connection string
6. Update `MONGODB_URI` in your backend .env

### Self-hosted MongoDB

1. Install MongoDB on your server
2. Configure authentication
3. Set up proper security rules
4. Configure backups
5. Update connection string

## Deployment Options

### Option 1: Traditional VPS/Server

**Requirements:**
- Ubuntu/CentOS server
- Node.js 14+
- MongoDB
- Nginx (recommended)
- PM2 for process management

**Steps:**

1. **Server Setup:**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install PM2
   sudo npm install -g pm2
   
   # Install Nginx
   sudo apt install nginx -y
   ```

2. **Deploy Application:**
   ```bash
   # Clone repository
   git clone https://github.com/Pronothurah/vantage_vertical_web.git
   cd vantage_vertical_web
   
   # Install dependencies
   npm run install-all
   
   # Build frontend
   cd frontend && npm run build && cd ..
   
   # Configure environment
   cp .env.example .env
   cp backend/.env.example backend/.env
   # Edit .env files with production values
   
   # Start backend with PM2
   pm2 start backend/index.js --name "vantage-backend"
   pm2 startup
   pm2 save
   ```

3. **Nginx Configuration:**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       # Frontend (React build)
       location / {
           root /path/to/vantage_vertical_web/frontend/build;
           index index.html index.htm;
           try_files $uri $uri/ /index.html;
       }
       
       # Backend API
       location /api {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

### Option 2: Heroku

**Frontend (Netlify/Vercel recommended for React):**

1. Build the frontend locally
2. Deploy the build folder to Netlify or Vercel
3. Configure environment variables

**Backend (Heroku):**

1. Create a Heroku app
2. Add MongoDB Atlas add-on or use external MongoDB
3. Configure environment variables
4. Deploy:
   ```bash
   # In backend directory
   git init
   git add .
   git commit -m "Initial commit"
   heroku git:remote -a your-app-name
   git push heroku main
   ```

### Option 3: Docker Deployment

**Dockerfile (Backend):**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY backend/package*.json ./
RUN npm ci --only=production

COPY backend/ .

EXPOSE 5000

CMD ["node", "index.js"]
```

**docker-compose.yml:**
```yaml
version: '3.8'

services:
  backend:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/vantage_vertical
    depends_on:
      - mongo

  mongo:
    image: mongo:5.0
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./frontend/build:/usr/share/nginx/html

volumes:
  mongo_data:
```

### Option 4: Cloud Platforms

**AWS:**
- Frontend: S3 + CloudFront
- Backend: EC2 or Elastic Beanstalk
- Database: DocumentDB or MongoDB Atlas

**Google Cloud:**
- Frontend: Firebase Hosting
- Backend: App Engine or Compute Engine
- Database: MongoDB Atlas

**Azure:**
- Frontend: Static Web Apps
- Backend: App Service
- Database: Cosmos DB or MongoDB Atlas

## SSL/HTTPS Setup

### Using Let's Encrypt (Free)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## Monitoring and Maintenance

### Health Checks

The backend includes a health check endpoint:
```
GET /health
```

### Logging

Configure proper logging for production:
- Application logs
- Error logs
- Access logs
- Database logs

### Backup Strategy

1. **Database Backups:**
   ```bash
   # MongoDB backup
   mongodump --uri="mongodb://localhost:27017/vantage_vertical" --out=/backup/$(date +%Y%m%d)
   ```

2. **Application Backups:**
   - Code repository (Git)
   - Environment configurations
   - SSL certificates
   - Static assets

### Performance Monitoring

- Use PM2 monitoring for Node.js
- Set up uptime monitoring (UptimeRobot, Pingdom)
- Monitor database performance
- Set up error tracking (Sentry)

### Security Checklist

- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] Database authentication enabled
- [ ] Firewall configured
- [ ] Regular security updates
- [ ] Input validation implemented
- [ ] Rate limiting configured
- [ ] CORS properly configured

## Troubleshooting

### Common Issues

1. **Build Failures:**
   - Check Node.js version compatibility
   - Clear npm cache: `npm cache clean --force`
   - Delete node_modules and reinstall

2. **Database Connection Issues:**
   - Verify MongoDB is running
   - Check connection string format
   - Verify network access/firewall rules

3. **CORS Errors:**
   - Verify FRONTEND_URL in backend .env
   - Check CORS configuration in backend

4. **Performance Issues:**
   - Enable gzip compression
   - Optimize images and assets
   - Use CDN for static files
   - Monitor database queries

### Support

For deployment issues:
- Check application logs
- Verify environment variables
- Test database connectivity
- Review server resources (CPU, memory, disk)

---

**Note:** Always test your deployment in a staging environment before going to production.