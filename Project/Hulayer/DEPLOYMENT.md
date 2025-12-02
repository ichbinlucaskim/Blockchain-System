# Deployment Guide

## Prerequisites

1. **Supabase Setup**
   - Create account at [supabase.com](https://supabase.com)
   - Create new project
   - Run `supabase/schema.sql` in SQL Editor
   - Copy Project URL and anon key

2. **World ID Setup**
   - Register at [developer.worldcoin.org](https://developer.worldcoin.org)
   - Create new app
   - Copy App ID
   - Use staging environment for testing

3. **Blockchain Setup**
   - Deploy `contracts/HumanPassport.sol` to Polygon (or Base)
   - Use Remix, Hardhat, or Foundry
   - Copy contract address

4. **Environment Variables**
   - Copy `.env.local.example` to `.env.local`
   - Fill in all required values

## Deployment Options

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Self-Hosted

1. Build the project:
   ```bash
   npm run build
   ```

2. Start production server:
   ```bash
   npm start
   ```

3. Use PM2 or similar for process management:
   ```bash
   pm2 start npm --name "human-layer" -- start
   ```

## Post-Deployment

1. Verify Supabase connection
2. Test World ID verification
3. Test wallet connection
4. Verify smart contract interaction
5. Test post creation

## Monitoring

- Set up error tracking (Sentry, etc.)
- Monitor Supabase usage
- Track blockchain transaction costs
- Monitor API rate limits

