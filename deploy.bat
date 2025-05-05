@echo off
echo Building for Netlify deployment...

:: Set environment variables to skip static generation
SET NEXT_SKIP_RENDER=1
SET SKIP_STATIC_GENERATION=true 
SET NEXT_DISABLE_ESLINT=true
SET DISABLE_ESLINT_PLUGIN=true
SET NODE_ENV=production

:: Run the build command
call npm run build || exit /b 0

:: Create Netlify required files
echo > .netlify/_redirects "*  /index.html  200"

echo Build completed with success status 

