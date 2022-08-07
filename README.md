# nft-viewer
WIP. Project for generating images, storing the images/metadata on IPFS, and then minting them as NFTs on the Ethereum blockchain.

It contains the following services/folders:
- ipfs-service
-- API for receiving data and uploading it to ipfs
- nft-generator
-- generates random images and jpegs.
- nft-minter (wip)
-- For sending transactions to Ethereum to mint NFTs
- smart-contracts
-- contains contracts for minting NFTs. Will likely be merted with nft-minter

Currently all services communicate over HTTP. In future it's probably better to use grpc and put these up on AWS.