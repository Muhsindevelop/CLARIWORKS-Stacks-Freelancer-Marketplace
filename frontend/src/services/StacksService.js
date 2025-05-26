import { AppConfig, UserSession, showConnect } from '@stacks/connect';
import { StacksTestnet, StacksMainnet } from '@stacks/network';
import { callReadOnlyFunction, makeContractCall } from '@stacks/transactions';
import { Storage } from '@stacks/storage';

// Configure network (testnet for development)
const network = new StacksTestnet();

// Configure Stacks Connect
const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

// Gaia storage instance
const storage = new Storage({ userSession });

export const StacksService = {
  // Authentication
  connectWallet: async () => {
    showConnect({
      appDetails: {
        name: 'Stacks Freelancer Marketplace',
        icon: '/logo.svg',
      },
      redirectTo: '/',
      onFinish: () => {
        window.location.reload();
      },
    });
  },
  
  isUserSignedIn: () => {
    return userSession.isUserSignedIn();
  },
  
  getUserData: () => {
    return userSession.loadUserData();
  },
  
  signOut: () => {
    userSession.signUserOut();
  },
  
  // Gaia Storage
  saveToGaia: async (filename, data) => {
    return await storage.putFile(filename, JSON.stringify(data));
  },
  
  getFromGaia: async (filename) => {
    const content = await storage.getFile(filename);
    return JSON.parse(content);
  },
  
  // Contract Interactions
  registerUser: async (username, userType, profileDataUrl) => {
    const functionArgs = [
      username,
      userType,
      profileDataUrl
    ];
    
    const options = {
      contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
      contractName: 'user-registry',
      functionName: 'register-user',
      functionArgs,
      network,
      appDetails: {
        name: 'Stacks Freelancer Marketplace',
        icon: '/logo.svg',
      },
      onFinish: data => {
        console.log('Transaction ID:', data.txId);
      }
    };
    
    await makeContractCall(options);
  },
  
  // Bidding functions
  submitBid: async (jobId, amount, proposalData) => {
    // First save proposal details to Gaia
    const proposalUrl = await storage.putFile(
      `proposals/job-${jobId}.json`, 
      JSON.stringify(proposalData)
    );
    
    // Then submit bid to contract
    const functionArgs = [
      jobId,
      amount,
      proposalUrl
    ];
    
    const options = {
      contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
      contractName: 'bidding',
      functionName: 'submit-bid',
      functionArgs,
      network,
      appDetails: {
        name: 'Stacks Freelancer Marketplace',
        icon: '/logo.svg',
      },
      onFinish: data => {
        console.log('Bid submitted, transaction ID:', data.txId);
      }
    };
    
    return await makeContractCall(options);
  },
  
  acceptBid: async (jobId, freelancerAddress) => {
    // Implementation for accepting a bid
    const functionArgs = [
      jobId,
      freelancerAddress
    ];
    
    const options = {
      contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
      contractName: 'bidding',
      functionName: 'accept-bid',
      functionArgs,
      network,
      appDetails: {
        name: 'Stacks Freelancer Marketplace',
        icon: '/logo.svg',
      },
      onFinish: data => {
        console.log('Bid accepted, transaction ID:', data.txId);
      }
    };
    
    return await makeContractCall(options);
  }
};

export default StacksService;
