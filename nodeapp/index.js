const PushAPI  = require("@pushprotocol/restapi");
const ethers = require('ethers');
let privateKey = "0x0781dd28de579c455ad3f90b69069954d7ad554fcc4784541f80d544fa211e09"
const signer = new ethers.Wallet(privateKey);
const DAOAddress = "0x856f773544be3b1fb70ce3847Bd07c68e44702b3";
let provider = new ethers.providers.JsonRpcProvider("https://eth-goerli.public.blastapi.io");
//  const user =  await PushAPI.user.get({
//     account: '0xc00ac4f9ef9f6C2c0Fad92e25A204D51fFD7C998', // user address in CAIP
//     env: 'staging'
//   })


// const userCreated =  await PushAPI.user.create({
//     account: '0xc00ac4f9ef9f6C2c0Fad92e25A204D51fFD7C998',
//     env: 'staging',

// })

// console.log (userCreated);

let ABI = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_member",
				"type": "address"
			}
		],
		"name": "addMember",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getMembers",
		"outputs": [
			{
				"internalType": "address[]",
				"name": "",
				"type": "address[]"
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
		"name": "members",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

async function tester() {
    const notifications = await PushAPI.user.getFeeds({
        user: 'eip155:5:0xc00ac4f9ef9f6C2c0Fad92e25A204D51fFD7C998', // user address in CAIP
        env: 'staging'
      });
    
      console.log(notifications);

      //VERIFY WHETHER SENDER BELONGS TO DAO    
      let contract = new ethers.Contract(DAOAddress, ABI, provider);
      let daomembers = await contract.getMembers.call();
        console.log(daomembers);
        let isMember = false;
        for (let i = 0; i < daomembers.length; i++) {
            if (daomembers[i] == signer.address) {
                isMember = true;
                break;
            }
        }
        if (isMember) {

      const apiResponse = await PushAPI.payloads.sendNotification({
        signer,
        type: 4,
        identityType: 2,
        notification: {
            title : "Message from " + signer.address,
            body : "Hello World",
        },
        payload: {
            title : "["+ DAOAddress +"] Message from " + signer.address,
            body : "Hello World",
        },
        recipients: daomembers.map((member) => {
            return "eip155:5:" + member;
        }),
        channel : "eip155:5:0xc00ac4f9ef9f6C2c0Fad92e25A204D51fFD7C998",
        env: 'staging'
      })
    }

    
}

tester();