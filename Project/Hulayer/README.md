# Human Layer - The Anti-AI Zone

**The First "Zero-Bot" Social Protocol**

Human Layer is a blockchain-based social platform that ensures only verified humans can participate. Built with World ID for human verification, blockchain for content signing, and AI detection to filter out AI-generated content.

## 🎯 Core Features

- **World ID Verification**: Proof-of-humanity using World ID's biometric verification
- **Soulbound Tokens (SBT)**: Non-transferable Human Passport NFTs
- **AI Content Detection**: Multi-layered AI detection to filter AI-generated content
- **Blockchain Signing**: All content is cryptographically signed
- **Zero-Bot Guarantee**: Only verified humans can create content

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Blockchain**: Wagmi, Viem, Ethers.js
- **Identity**: World ID SDK
- **Backend**: Supabase (PostgreSQL)
- **Smart Contracts**: Solidity (Soulbound Token)

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- World ID App ID (from [Worldcoin Developer Portal](https://developer.worldcoin.org))
- MetaMask or compatible wallet

## 🚀 Getting Started

### 1. Clone and Install

```bash
cd human-layer
npm install
```

### 2. Environment Variables

Create a `.env.local` file:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# World ID
NEXT_PUBLIC_WORLD_ID_APP_ID=app_staging_xxx
NEXT_PUBLIC_WORLD_ID_ACTION=human-layer-verify

# Blockchain
NEXT_PUBLIC_CHAIN_ID=137
NEXT_PUBLIC_RPC_URL=https://polygon-rpc.com

# Smart Contract (deploy first)
NEXT_PUBLIC_SBT_CONTRACT_ADDRESS=0x...

# AI Detection (Optional)
AI_DETECTION_API_KEY=your_api_key
```

### 3. Set Up Supabase

1. Create a new Supabase project
2. Run the SQL schema from `supabase/schema.sql` in your Supabase SQL editor
3. Copy your project URL and anon key to `.env.local`

### 4. Deploy Smart Contract

The Human Passport SBT contract is in `contracts/HumanPassport.sol`. Deploy it to Polygon (or your preferred chain) using:

- Hardhat
- Remix
- Foundry

Update `NEXT_PUBLIC_SBT_CONTRACT_ADDRESS` with the deployed address.

### 5. Set Up World ID

1. Go to [Worldcoin Developer Portal](https://developer.worldcoin.org)
2. Create a new app
3. Copy your App ID to `.env.local`

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
human-layer/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── providers.tsx      # Wagmi/React Query providers
├── components/            # React components
│   ├── PostCard.tsx
│   ├── PostEditor.tsx
│   ├── WalletConnect.tsx
│   └── WorldIDAuth.tsx
├── contracts/             # Smart contracts
│   └── HumanPassport.sol
├── lib/                  # Utilities
│   ├── ai-detection.ts
│   ├── blockchain.ts
│   ├── supabase.ts
│   └── wagmi.ts
├── store/                # State management
│   └── auth-store.ts
├── supabase/             # Database schema
│   └── schema.sql
└── types/                # TypeScript types
    └── database.ts
```

## 🔐 Authentication Flow

1. User connects wallet (MetaMask, etc.)
2. User verifies with World ID (biometric scan)
3. Backend verifies World ID proof
4. Smart contract mints Human Passport SBT
5. User can now create posts

## ✍️ Content Creation Flow

1. User types content (copy-paste disabled)
2. Client-side AI detection runs
3. User signs content with wallet
4. Server-side AI detection runs
5. Content hash stored on blockchain
6. Post saved to Supabase
7. Post appears in feed

## 🤖 AI Detection

The platform uses multiple methods to detect AI-generated content:

1. **Pattern Analysis**:
   - Typing speed detection
   - Copy-paste detection
   - Sentence structure analysis
   - Common AI phrase detection

2. **API Detection** (Optional):
   - GPTZero API
   - OpenAI Classifier
   - Custom models

## 🔒 Security Features

- **Soulbound Tokens**: Non-transferable, preventing account trading
- **World ID Nullifier Hash**: Prevents duplicate verification
- **Content Signing**: Cryptographic proof of authorship
- **AI Filtering**: Multi-layer AI detection
- **Blockchain Storage**: Immutable content hashes

## 📱 Mobile Support

The platform is fully responsive and works on mobile browsers. For native apps, consider:

- React Native wrapper
- Progressive Web App (PWA)
- Capacitor/Cordova

## 🚧 Roadmap

- [ ] SBT minting automation
- [ ] IPFS integration for content storage
- [ ] Comment system
- [ ] Reputation system
- [ ] Token rewards for creators
- [ ] Mobile app
- [ ] Advanced AI detection models

## 📝 License

MIT

## 🙏 Acknowledgments

- World ID / Worldcoin for human verification
- Supabase for backend infrastructure
- The open-source community

---

**Built with ❤️ for humans, by humans.**
