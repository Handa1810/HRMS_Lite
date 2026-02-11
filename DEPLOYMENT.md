# Deployment Guide

## Quick Start

Your HRMS application is production-ready and can be deployed immediately!

## What's Already Done

1. Database schema created in Supabase with:
   - `employees` table
   - `attendance` table
   - Row Level Security enabled
   - Proper indexes and constraints

2. Frontend built and optimized:
   - Production build in `dist/` folder
   - Environment variables configured
   - All dependencies installed

3. Configuration files ready:
   - `vercel.json` for Vercel deployment
   - `netlify.toml` for Netlify deployment

## Deployment Steps

### Option 1: Deploy to Vercel (Recommended - Free Tier Available)

1. Create a Vercel account at https://vercel.com

2. Install Vercel CLI:
```bash
npm install -g vercel
```

3. Deploy from project root:
```bash
vercel
```

4. Follow the prompts:
   - Set up project: Yes
   - Which scope: Select your account
   - Link to existing project: No
   - What's the name: hrms-lite (or your preferred name)
   - What's the directory: ./ (current directory)
   - Override settings: No

5. Add environment variables in Vercel dashboard:
   - Go to your project settings
   - Navigate to Environment Variables
   - Add:
     - `VITE_SUPABASE_URL` = your Supabase project URL
     - `VITE_SUPABASE_ANON_KEY` = your Supabase anon key

6. Redeploy to apply environment variables:
```bash
vercel --prod
```

Your app will be live at: https://your-project.vercel.app

### Option 2: Deploy to Netlify (Free Tier Available)

1. Create a Netlify account at https://netlify.com

2. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

3. Login:
```bash
netlify login
```

4. Deploy:
```bash
netlify deploy --prod
```

5. Follow the prompts:
   - Create & configure a new site: Yes
   - Team: Select your team
   - Site name: hrms-lite (or your preferred name)
   - Publish directory: dist

6. Add environment variables in Netlify dashboard:
   - Go to Site settings > Environment variables
   - Add:
     - `VITE_SUPABASE_URL` = your Supabase project URL
     - `VITE_SUPABASE_ANON_KEY` = your Supabase anon key

7. Rebuild site to apply environment variables

Your app will be live at: https://your-site.netlify.app

### Option 3: Deploy to GitHub Pages

1. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

2. Add to package.json scripts:
```json
"predeploy": "npm run build",
"deploy": "gh-pages -d dist"
```

3. Update vite.config.ts base path:
```typescript
export default defineConfig({
  base: '/your-repo-name/',
  // ... rest of config
})
```

4. Deploy:
```bash
npm run deploy
```

Your app will be live at: https://yourusername.github.io/your-repo-name/

### Option 4: Deploy to Firebase Hosting

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login:
```bash
firebase login
```

3. Initialize Firebase:
```bash
firebase init hosting
```

4. Configure:
   - Public directory: dist
   - Single-page app: Yes
   - GitHub auto-deploys: Optional

5. Deploy:
```bash
firebase deploy --only hosting
```

Your app will be live at: https://your-project.web.app

## Environment Variables

Your Supabase credentials are in the `.env` file:
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY

When deploying, make sure to set these environment variables in your hosting platform's dashboard.

## Security Notes

1. Never commit `.env` file to version control
2. Use environment variables for sensitive data
3. Supabase RLS policies are already configured for basic security
4. Consider adding authentication for production use

## Post-Deployment Checklist

- [ ] Environment variables configured
- [ ] Application loads correctly
- [ ] Can add employees
- [ ] Can mark attendance
- [ ] Dashboard displays data
- [ ] Charts render properly
- [ ] Mobile responsive

## Troubleshooting

### Application shows blank page
- Check browser console for errors
- Verify environment variables are set correctly
- Ensure build completed successfully

### Database connection errors
- Verify Supabase URL and anon key are correct
- Check Supabase project is active
- Verify RLS policies are enabled

### Build fails
- Run `npm install` to ensure all dependencies are installed
- Check Node.js version (requires 18+)
- Clear node_modules and reinstall if issues persist

## Support

For deployment issues, check:
- Vercel documentation: https://vercel.com/docs
- Netlify documentation: https://docs.netlify.com
- Supabase documentation: https://supabase.com/docs

## Next Steps

After deployment:
1. Add authentication (optional)
2. Customize branding and colors
3. Add more features as needed
4. Set up continuous deployment
5. Configure custom domain
