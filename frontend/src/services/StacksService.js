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
  
  // Additional contract interaction methods
};

export default StacksService;