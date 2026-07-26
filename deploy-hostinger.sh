#!/bin/bash
# ============================================================
# TimezoneHub Deployment Script for Hostinger Shared Hosting
# ============================================================
# Run: bash deploy-hostinger.sh

set -e

echo "🚀 Building TimezoneHub for production..."
echo ""

# 1. Install dependencies
echo "📦 Installing dependencies..."
npm ci --production=false

# 2. Generate Prisma client
echo "🗄️  Generating Prisma client..."
npx prisma generate

# 3. Push database schema
echo "🗄️  Pushing database schema..."
npx prisma db push

# 4. Seed database (optional - only first time)
echo "🌱 Seeding database..."
npx tsx prisma/seed.ts

# 5. Build Next.js
echo "🔨 Building Next.js..."
npm run build

# 6. Prepare deployment package
echo "📦 Preparing deployment package..."
rm -rf deploy-package
mkdir -p deploy-package

# Copy standalone output
cp -r .next/standalone/* deploy-package/

# Copy static files
mkdir -p deploy-package/.next/static
cp -r .next/static/* deploy-package/.next/static/

# Copy public files
cp -r public deploy-package/public 2>/dev/null || true

# Copy Prisma schema and DB
mkdir -p deploy-package/prisma
cp prisma/schema.prisma deploy-package/prisma/
cp prisma/dev.db deploy-package/prisma/prod.db 2>/dev/null || true

# Copy .env
cp .env deploy-package/.env

# 7. Create the start script for Hostinger
cat > deploy-package/start.sh << 'STARTSCRIPT'
#!/bin/bash
cd "$(dirname "$0")"
# Hostinger Node.js app uses PORT from environment
export PORT=${PORT:-3000}
export HOSTNAME=0.0.0.0
node server.js
STARTSCRIPT
chmod +x deploy-package/start.sh

# 8. Create .htaccess for Apache proxy (if needed)
cat > deploy-package/.htaccess << 'HTACCESS'
RewriteEngine On
RewriteRule ^(.*)$ http://localhost:3000/$1 [P,L]
HTACCESS

echo ""
echo "✅ Build complete!"
echo ""
echo "📁 Deployment package: ./deploy-package/"
echo ""
echo "=== HOW TO DEPLOY TO HOSTINGER ==="
echo ""
echo "1. Compress the deploy-package folder:"
echo "   zip -r timezonehub.zip deploy-package/"
echo ""
echo "2. Upload to Hostinger via FTP or File Manager"
echo "   - Go to cPanel → File Manager → public_html (or a subdomain folder)"
echo "   - Upload and extract timezonehub.zip"
echo ""
echo "3. In Hostinger cPanel:"
echo "   - Go to 'Setup Node.js App'"
echo "   - Create a new Node.js app"
echo "   - Application root: public_html/deploy-package (or your folder)"
echo "   - Application URL: yourdomain.com"
echo "   - Application startup file: server.js"
echo "   - Node.js version: 20.x"
echo "   - Click 'Create' then 'Run NPM Install' (run: npm install)"
echo ""
echo "4. Update .env file with your production values"
echo ""
echo "5. Access your site at your domain!"
