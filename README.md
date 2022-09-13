# nft-viewer

Project for generating images, storing the images/metadata on IPFS, and then minting them as NFTs on the Ethereum blockchain.

# Demo


https://user-images.githubusercontent.com/8813282/189784851-87414903-4462-4abd-b2f6-2da9fe87c598.mov



<img width="1182" alt="Screen Shot 2022-09-12 at 12 33 25" src="https://user-images.githubusercontent.com/8813282/189569174-5ae5ede0-c466-41f7-9e61-634d23d872a0.png">

1. A user requests an image to be generated as their avatar
2. The image generation service produces an image
3. The image is sent to the IPFS pinning service, which forwards it to Pinata (In reality, this should be done after the user approves the image (which should be generated client-side, not server side), to prevent sending unwanted data to IPFS).
4. The Pinata webservice writes the image to IPFS, and returns a content id (CID)
5. The user approves the image, connects their wallet, and approve the transaction for turning their image into an NFT.
6. Alchemey connects to the Goerli Ethereum test net, and uses an ERC721 smart contract to mint an NFT
7. The smart contract writes the CID of the image data to the address of the user. The NFT has been minted.
8. Later, a user wishing to see their NFT connects to the site. They will have to connect to Metamask.
9. The NFT Minting/Reading service sends a read transaction to Alchemy
10. Alchemy forwards this to the smart contract, which returns all NFT CIDs assocaited with the user's address
11. The CID is sent to the IPFS service
12. The IPFS service forwards the CID to Pinata, which returns the actual content from IPFS
The NFT data can now be displayed as an image avatar for the user.




It contains the following services/folders:

- fe
  -- run this to see the finished product. An initial image will load from storage. A user can generate a new image, mint it as an NFT, and then their profile picture will be replaced with the NFT
- nft-generator
  -- Generates random jpegs
- ipfs-service
  -- API for receiving image data and uploading it to ipfs
- smart-contracts
  -- Contains contracts for minting NFTs.
  -- Contains Express api for sending transactions to Ethereum to mint NFTs

Currently all services communicate over HTTP. In future it's worth explorign gRPC

# setup and run
run `npm i` within `nft-generator`, `ipfs-service`, and `smart-contracts`.

TBD
