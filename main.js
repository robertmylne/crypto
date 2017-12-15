let SHA256 = require('crypto-js/sha256')

//todo: rollback changes to a correct state
//todo: check if there is enough funds to make transaction
//todo: peer to peer network

class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index // Where the block sits on the chain
        this.timestamp = timestamp // When the block was created
        this.data = data // Details of transaction
        this.previousHash = previousHash // The hash of the last block
        this.hash = this.calculateHash()
        this.nonce = 0
    }

    calculateHash() {
        return SHA256(
            this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce
        ).toString()
    }

    mineBlock(difficulty) {
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
            this.nonce++
            this.hash = this.calculateHash()
        }
        
        console.log(`Block mined: ${this.hash}`);
    }
}

class BlockChain {
    constructor() {
        this.chain = [this.createGenesisBlock()]
        this.difficulty = 4
    }

    createGenesisBlock() {
        return new Block(0, Date.now(), "Genesis block")
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1]
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash
        newBlock.mineBlock(this.difficulty)
        this.chain.push(newBlock)
    }

    isChainValid() {
        for(let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i]
            const previousBlock = this.chain[i - 1]

            // Check if the current blocks hash calculates correctly and is still valid
            if(currentBlock.hash !== currentBlock.calculateHash()) {
                return false
            }

            // Check if the current blocks previous hash equals the previous blocks hash
            if(currentBlock.previousHash !== previousBlock.hash) {
                return false
            }
        }

        return true
    }

    print() {
        console.log(this)
    }
}

// Create coin and add some transactions
let coin = new BlockChain()

console.log('Mining block 1');
coin.addBlock(new Block(1, Date.now(), { amount: 4 }))

console.log('Mining block 2');
coin.addBlock(new Block(2, Date.now(), { amount: 6 }))

// Check if blockchain is valid
console.log(`Is blockchain valid: ${coin.isChainValid()}`)

// Try to tamper with blockchain
coin.chain[1].data = { amount: 100 }

// Check if blockchain is valid
console.log(`Is blockchain valid: ${coin.isChainValid()}`)

coin.print()