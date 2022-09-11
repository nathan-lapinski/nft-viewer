# nft-viewer

Project for generating images, storing the images/metadata on IPFS, and then minting them as NFTs on the Ethereum blockchain.

It contains the following services/folders:

- fe (WIP - unstable)
  -- run this to see the finished product. An initial image will load, then it will be replaced with an NFT image
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
