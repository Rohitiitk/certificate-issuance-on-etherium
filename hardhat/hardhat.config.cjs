// require("@nomicfoundation/hardhat-toolbox");
require('@nomiclabs/hardhat-ethers');
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 2
      }
    }
  },
  defaultNetwork:"hardhat",
  networks:{
    localhost: {
      url:"http://127.0.0.1:8545"
    },
    hardhat:{
      
    }
  }
  
};
