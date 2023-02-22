const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { assert } = require("chai");

describe("Game5", function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory("Game5");
    const game = await Game.deploy();

    const signers = await ethers.getSigners();

    let wallet = null;
    while (true) {
      wallet = ethers.Wallet.createRandom();

      // if wallet is less than 0x00FFF..FFF
      if (wallet.address.toLowerCase().startsWith("0x00")) {
        wallet = wallet.connect(ethers.provider);

        // send some money to that wallet from first signer
        // because otherwise generated wallet will not be able to
        // interact with smart contract
        await signers[0].sendTransaction({
          to: wallet.address,
          value: ethers.utils.parseEther("0.1"),
        });

        console.log("found wallet", wallet.address);
        break;
      }
    }

    return { game, wallet };
  }
  it("should be a winner", async function () {
    const { game, wallet } = await loadFixture(deployContractAndSetVariables);

    // good luck

    // use 0x00.... wallet to win the game
    await game.connect(wallet).win();

    // leave this assertion as-is
    assert(await game.isWon(), "You did not win the game");
  });
});
