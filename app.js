// Connect to Ethereum
window.addEventListener('load', async () => {
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        try {
            await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{
                    chainId: '11011', // 69 in hex, Optimistic Kovan Testnet Chain ID
                    chainName: 'Shape Sepolia',
                    rpcUrls: ['https://sepolia.shape.network/'],
                    blockExplorerUrls: ['https://shape-sepolia-explorer.alchemy.com'],
                    nativeCurrency: {
                        name: 'Ethereum',
                        symbol: 'ETH',
                        decimals: 18
                    }
                }]
            });
            await window.ethereum.enable();
        } catch (error) {
            console.error('User rejected request');
        }

    } else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
});

// Contract ABI and Address
const contractABI = [ [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "wallet",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "bytes",
				"name": "signature",
				"type": "bytes"
			}
		],
		"name": "SignatureCollected",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "MAX_SIGNATURES",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes",
				"name": "_signature",
				"type": "bytes"
			}
		],
		"name": "addSignature",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getSignatures",
		"outputs": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "wallet",
						"type": "address"
					},
					{
						"internalType": "bytes",
						"name": "signature",
						"type": "bytes"
					}
				],
				"internalType": "struct collect.Signature[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "hasSigned",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "signatures",
		"outputs": [
			{
				"internalType": "address",
				"name": "wallet",
				"type": "address"
			},
			{
				"internalType": "bytes",
				"name": "signature",
				"type": "bytes"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]];
const contractAddress = '0x72fE3C398C9A030b9b2be1fe1Ff07701167571d4';

// Get the user's account
let account;
web3.eth.getAccounts().then(accounts => {
    account = accounts[0];
    document.getElementById('account').innerText = `Connected Account: ${account}`;
});

// Create contract instance
const contract = new web3.eth.Contract(contractABI, contractAddress);

// Add signature function
document.getElementById('addSignatureButton').addEventListener('click', () => {
    const signature = document.getElementById('signatureInput').value;
    contract.methods.addSignature(web3.utils.asciiToHex(signature)).send({ from: account })
        .on('receipt', () => {
            console.log('Signature added successfully');
            loadSignatures();
        })
        .on('error', console.error);
});

// Load signatures
function loadSignatures() {
    contract.methods.getSignatures().call()
        .then(signatures => {
            const signaturesDiv = document.getElementById('signatures');
            signaturesDiv.innerHTML = '';
            signatures.forEach(sig => {
                const sigDiv = document.createElement('div');
                sigDiv.innerHTML = `<strong>${sig.wallet}:</strong> ${web3.utils.hexToAscii(sig.signature)}`;
                signaturesDiv.appendChild(sigDiv);
            });
        })
        .catch(console.error);
}

// Load signatures on page load
loadSignatures();

