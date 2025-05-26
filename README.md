# CLARIWORKS || Stacks Freelancer Marketplace

A decentralized freelancing platform built on the Stacks blockchain, enabling secure and transparent interactions between clients and freelancers without intermediaries.

## Overview

This project leverages blockchain technology to create a trustless freelancing ecosystem where:

- Clients can post jobs and hire freelancers
- Freelancers can create profiles and apply for jobs
- Payments are secured through smart contract escrow
- Work deliverables can be minted as NFTs
- Platform governance is managed by community voting

## Technology Stack

- **Blockchain**: [Stacks](https://www.stacks.co/) - Bitcoin layer for smart contracts
- **Smart Contracts**: [Clarity](https://clarity-lang.org/) - Decidable smart contract language
- **Frontend**: React.js with [Stacks.js](https://github.com/hirosystems/stacks.js) libraries
- **Storage**: [Gaia](https://docs.stacks.co/build-apps/references/gaia) - Decentralized storage system
- **Testing**: [Clarinet](https://github.com/hirosystems/clarinet) - Clarity testing framework

## Project Structure

```
stacks-freelancer-marketplace/
├── contracts/                # Clarity smart contracts
│   ├── user-registry.clar    # User profiles and authentication
│   ├── job-registry.clar     # Job listings management
│   ├── bidding.clar          # Bid submission and acceptance
│   ├── escrow.clar           # Payment handling and disputes
│   ├── nft-minting.clar      # NFT creation for deliverables
│   └── governance.clar       # Voting and platform rules
├── frontend/                 # React.js application
│   ├── src/
│   │   ├── components/       # UI components
│   │   ├── pages/            # Application pages
│   │   ├── services/         # API and blockchain services
│   │   └── utils/            # Helper functions
│   └── public/
├── tests/                    # Clarinet test files
└── docs/                     # Documentation
```

## Installation and Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later)
- [Clarinet](https://github.com/hirosystems/clarinet) for Clarity development
- [Stacks CLI](https://github.com/hirosystems/stacks.js/tree/master/packages/cli) for deployment

### Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/Muhsindevelop/Decentralized-freelancing-platform-built-on-stack-blockchain
   cd Decentralized-freelancing-platform-built-on-stack-blockchain
   ```

2. Install dependencies for the frontend:
   ```bash
   cd frontend
   npm install
   ```

3. Set up Clarinet for local development:
   ```bash
   # Install Clarinet if you haven't already
   curl -sL https://github.com/hirosystems/clarinet/releases/download/v1.0.0/clarinet-linux-x64.tar.gz -o clarinet.tar.gz
   tar -xf clarinet.tar.gz
   chmod +x clarinet
   mv clarinet /usr/local/bin/
   
   # Initialize Clarinet in the project
   cd ..
   clarinet new
   ```

## Smart Contract Deployment

### Local Development

1. Start the local Clarinet console:
   ```bash
   clarinet console
   ```

2. Test your contracts in the console:
   ```clarity
   (contract-call? .user-registry register-user "username" "client" "profile-url")
   ```

### Testnet Deployment

1. Configure your deployment settings in `Clarinet.toml`

2. Deploy to the Stacks testnet:
   ```bash
   clarinet deploy --testnet
   ```

3. Update the contract address in `frontend/src/services/StacksService.js` with your deployed contract address

## Running the Frontend

1. Start the development server:
   ```bash
   cd frontend
   npm start
   ```

2. Open your browser and navigate to `http://localhost:3000`

## Features (Month 1 Implementation)

### User Management
- Wallet connection and authentication
- User profile creation (client/freelancer)
- Profile data storage on Gaia
- On-chain user registry with roles

### Job Registry
- Job creation with title, description, budget, and deadline
- Job listing and browsing
- Job status management (open, assigned, completed, cancelled)
- Client and freelancer job tracking

## Roadmap

### Month 2: Bidding System
- Bid submission by freelancers
- Bid acceptance by clients
- Reputation system integration

### Month 3: Escrow & Payments
- Secure payment escrow
- Milestone-based releases
- Dispute resolution mechanism

### Month 4: NFT Deliverables
- Minting completed work as NFTs
- Ownership transfer upon payment
- Portfolio building with NFTs

### Month 5: Governance
- Community voting on platform rules
- Fee structure governance
- Dispute resolution participation

## Contributing

We welcome contributions to the Stacks Freelancer Marketplace!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please make sure to update tests as appropriate and adhere to the Clarity best practices.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Stacks Foundation](https://stacks.org/)
- [Hiro Systems](https://www.hiro.so/)
- [Clarity Language Documentation](https://docs.stacks.co/write-smart-contracts/overview)
