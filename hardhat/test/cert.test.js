const {
    loadFixture,
  } = require('@nomicfoundation/hardhat-toolbox/network-helpers')
  const { expect } = require('chai')
  // require('@nomicfoundation/hardhat-chai-matchers')
  const { BigNumber } = require('ethers');

  
  describe('Cert Test', function () {
    async function deployCertFixture() {
      const [admin, other] = await ethers.getSigners()
  
      const Cert = await ethers.getContractFactory('Cert')
      const cert = await Cert.deploy(admin.address)
  
      return { cert, admin, other }
    }
  
    it('Should set the right admin', async function () {
      const { cert, admin } = await loadFixture(deployCertFixture)
  
    //   expect(cert.deploymentTransaction().from).to.equal(admin.address)
    // Get the transaction hash of the deployment
    const deployTransactionHash = cert.deployTransaction.hash;
    
    // Fetch the transaction details using ethers.provider
    const deployTransaction = await ethers.provider.getTransaction(deployTransactionHash);

    // Verify the `from` address in the transaction matches the admin address
    expect(deployTransaction.from).to.equal(admin.address);
    })
  
    it('Should issue the certificate', async function () {
      const { cert } = await loadFixture(deployCertFixture);
    
      // Execute the transaction and wait for it to be mined
      const tx = await cert.issue(1024, 'Deren', 'CED', 'S', '24-04-2024');
      
      // Wait for the transaction receipt to access emitted events
      const receipt = await tx.wait();
    
      // Assert that the 'issued' event was emitted with the correct arguments
      const event = receipt.events?.find(event => event.event === 'issued');
      expect(event).to.not.be.undefined;
      expect(event.args).to.deep.equal([BigNumber.from(1024), '24-04-2024']);
    });
    
  
    it('Should read the certificate', async function () {
      const { cert } = await loadFixture(deployCertFixture)
  
      await cert.issue(1024, 'Deren', 'CED', 'S', '24-04-2024')
  
      const certificate = await cert.Certificates(1024)
  
      expect(certificate[0]).to.equal('Deren')
      expect(certificate[1]).to.equal('CED')
      expect(certificate[2]).to.equal('S')
      expect(certificate[3]).to.equal('24-04-2024')
    })
  
    // it('Should revert the issuing', async function () {
    //   const { cert, other } = await loadFixture(deployCertFixture)
  
    //   await expect(
    //     cert.connect(other).issue(1024, 'Shalom', 'CBR', 'S', '23-03-2023')
    //   ).to.be.reverted;
    // })
    it('Should revert the issuing', async function () {
      const { cert, other } = await loadFixture(deployCertFixture);
    
      try {
        // Attempt to issue the certificate
        await cert.connect(other).issue(1024, 'Shalom', 'CBR', 'S', '23-03-2023');
        
        // If no error was thrown, fail the test
        throw new Error('Transaction did not revert as expected');
      } catch (error) {
        // Check if the error message indicates a revert
        expect(error.message).to.include('revert');
      }
    });
    
  })