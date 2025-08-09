# Deployment Guide - Vantage Vertical

This guide covers deploying the Vantage Vertical Next.js website to Netlify using static site generation.

## Table of Contents

1. [Production Build](#production-build)
2. [Environment Configuration](#environment-configuration)
3. [Netlify Deployment](#netlify-deployment)
4. [Custom Domain Setup](#custom-domain-setup)
5. [Monitoring and Maintenance](#monitoring-and-maintenance)

## Production Build

The Vantage Vertical website is built as a static Next.js application optimized for Netlify hosting.

### Building the Static Export

```bash
# Install dependencies
npm install

# Run type checking (optional but recommended)
npm run type-check

# Build the static export
npm run build
```

This creates an optimized static build in the `out/` directory, ready for deployment to Netlify.

### Build Process Details

The build process:
1. Compiles TypeScript to JavaScript
2. Optimizes and bundles all assets
3. Generates static HTML pages for all routes
4. Creates a static export in the `out/` directory
5. Optimizes images and other assets for web delivery

## Environment Configuration

### Environment Variables for Netlify

Configure the following environment variables in your Netlify dashboard:

#### Required Variables

```env
# Site Configuration
NEXT_PUBLIC_SITE_URL=https://vantagevertical.co.ke
NEXT_PUBLIC_CONTACT_EMAIL=vantagevarticalltd@gmail.com
NEXT_PUBLIC_PHONE_NUMBER=+254704277687
```

#### Optional Variables

```env
# Analytics (Optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your-google-verification-code
NEXT_PUBLIC_BING_VERIFICATION=your-bing-verification-code

# Email Configuration (for contact forms)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@vantagevertical.co.ke
```

### Setting Environment Variables in Netlify

1. Go to your Netlify site dashboard
2. Navigate to **Site settings** → **Environment variables**
3. Click **Add variable** for each environment variable
4. Enter the variable name and value
5. Click **Save**

**Important:** Only variables prefixed with `NEXT_PUBLIC_` are available in the browser. Server-side variables (like SMTP credentials) are only available during the build process.

## Netlify Deployment

### Option 1: Git-based Deployment (Recommended)

This is the most common and recommended approach for continuous deployment.

#### Initial Setup

1. **Connect Repository:**
   - Log in to [Netlify](https://netlify.com)
   - Click **New site from Git**
   - Choose your Git provider (GitHub, GitLab, Bitbucket)
   - Select the `vantage_vertical_web` repository

2. **Configure Build Settings:**
   - **Base directory:** Leave empty (root directory)
   - **Build command:** `npm run build`
   - **Publish directory:** `out`
   - **Production branch:** `main` (or your default branch)

3. **Deploy:**
   - Click **Deploy site**
   - Netlify will automatically build and deploy your site
   - You'll get a random subdomain like `https://amazing-site-123456.netlify.app`

#### Automatic Deployments

Once set up, Netlify will automatically:
- Deploy when you push to the main branch
- Create deploy previews for pull requests
- Show build logs and deployment status

### Option 2: Manual Deployment

For one-time deployments or testing:

1. **Build Locally:**
   ```bash
   npm install
   npm run build
   ```

2. **Deploy via Netlify CLI:**
   ```bash
   # Install Netlify CLI
   npm install -g netlify-cli
   
   # Login to Netlify
   netlify login
   
   # Deploy to production
   netlify deploy --prod --dir=out
   ```

3. **Deploy via Web Interface:**
   - Go to [Netlify](https://netlify.com)
   - Drag and drop the `out/` folder to the deploy area

### Build Configuration

Create a `netlify.toml` file in your project root for advanced configuration:

```toml
[build]
  command = "npm run build"
  publish = "out"

[build.environment]
  NODE_VERSION = "18"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "/api/*"
  [headers.values]
    Cache-Control = "no-cache"

[[headers]]
  for = "/*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.css"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
```

## Custom Domain Setup

### Adding Your Custom Domain

1. **In Netlify Dashboard:**
   - Go to **Site settings** → **Domain management**
   - Click **Add custom domain**
   - Enter your domain (e.g., `vantagevertical.co.ke`)
   - Click **Verify**

2. **DNS Configuration:**
   
   **Option A: Netlify DNS (Recommended)**
   - Use Netlify's nameservers for full DNS management
   - Netlify will provide nameservers like:
     ```
     dns1.p01.nsone.net
     dns2.p01.nsone.net
     dns3.p01.nsone.net
     dns4.p01.nsone.net
     ```
   - Update your domain registrar to use these nameservers

   **Option B: External DNS**
   - Keep your current DNS provider
   - Add these DNS records:
     ```
     Type: CNAME
     Name: www
     Value: your-site-name.netlify.app
     
     Type: A
     Name: @
     Value: 75.2.60.5
     ```

### SSL Certificate

Netlify automatically provides free SSL certificates via Let's Encrypt:

1. **Automatic SSL:**
   - SSL is enabled automatically for custom domains
   - Certificates auto-renew every 90 days
   - No manual configuration required

2. **Force HTTPS:**
   - Go to **Site settings** → **Domain management**
   - Enable **Force HTTPS redirect**
   - All HTTP traffic will redirect to HTTPS

### Domain Verification

After DNS changes:
1. Wait for DNS propagation (can take up to 48 hours)
2. Netlify will automatically verify the domain
3. SSL certificate will be issued automatically
4. Your site will be available at your custom domain

## Monitoring and Maintenance

### Netlify Analytics

Enable Netlify Analytics for insights:
1. Go to **Site settings** → **Analytics**
2. Enable **Netlify Analytics**
3. View traffic, performance, and user data

### Performance Monitoring

#### Built-in Monitoring
- **Deploy logs:** View build and deployment logs
- **Function logs:** Monitor serverless function performance
- **Bandwidth usage:** Track data transfer
- **Build minutes:** Monitor build time usage

#### External Monitoring
- **Google Analytics:** Add your GA measurement ID to environment variables
- **Uptime monitoring:** Use services like UptimeRobot or Pingdom
- **Performance monitoring:** Use Google PageSpeed Insights or GTmetrix

### Maintenance Tasks

#### Regular Updates
```bash
# Update dependencies
npm update

# Check for security vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

#### Performance Optimization
- Monitor Core Web Vitals in Google Search Console
- Optimize images using Next.js Image component
- Review and minimize bundle size
- Enable compression and caching headers

### Backup Strategy

#### Automated Backups
- **Git repository:** Your code is backed up in your Git repository
- **Netlify deploys:** Netlify keeps a history of all deployments
- **Environment variables:** Export and backup your environment variables

#### Manual Backups
```bash
# Export site configuration
netlify sites:list
netlify env:list --site-id=your-site-id

# Backup build artifacts
cp -r out/ backup/$(date +%Y%m%d)/
```

## Troubleshooting

### Common Build Issues

1. **Build Failures:**
   ```bash
   # Clear npm cache
   npm cache clean --force
   
   # Delete node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   
   # Check Node.js version (should be 18+)
   node --version
   ```

2. **Environment Variable Issues:**
   - Ensure variables are set in Netlify dashboard
   - Check variable names (case-sensitive)
   - Verify `NEXT_PUBLIC_` prefix for client-side variables

3. **Static Export Issues:**
   - Check `next.config.js` has `output: 'export'`
   - Ensure no server-side features are used inappropriately
   - Review build logs for specific errors

### Common Deployment Issues

1. **404 Errors:**
   - Verify `publish` directory is set to `out`
   - Check that all routes are properly generated
   - Ensure trailing slashes are configured correctly

2. **Asset Loading Issues:**
   - Verify `NEXT_PUBLIC_SITE_URL` is set correctly
   - Check image optimization settings
   - Review asset paths in build output

3. **Custom Domain Issues:**
   - Verify DNS records are correct
   - Wait for DNS propagation (up to 48 hours)
   - Check domain verification status in Netlify

### Performance Issues

1. **Slow Loading:**
   - Optimize images and assets
   - Enable compression in `netlify.toml`
   - Use Next.js Image component for automatic optimization
   - Review bundle size and remove unused dependencies

2. **Build Time Issues:**
   - Review build logs for bottlenecks
   - Optimize dependencies and imports
   - Consider build caching strategies

### Getting Help

- **Netlify Support:** [Netlify Support Center](https://support.netlify.com)
- **Build Logs:** Check detailed build logs in Netlify dashboard
- **Community:** [Netlify Community Forum](https://community.netlify.com)
- **Next.js Documentation:** [Next.js Static Export Guide](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)

---

**Note:** Always test your deployment with a staging site before deploying to production. Netlify makes this easy with branch deploys and deploy previews.