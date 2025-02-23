import { CoreAddressesModel } from '../../models/core-addresses.model';

export const FANTOM_CORE = new CoreAddressesModel(
  '0xE5365c31c08d6ee44fdd33394ba279b85557c449', // controller
  '0xe4436821E403e78a6Dd62f7a9F5611f97a18f44C', // gameToken
  '0x7C01992Cd34Cd81d48b41E878Bd1765351e2A4eb', // minter
  '0xDdA2b04b32BF1EAe68A84e13521E29F24172f18c', // goc
  '0xA2D15afbD6C2018BF2909577Af9f134d3dEbE74e', // reinforcementController
  '0x89e8FA64D576d84E0143Af9ee9c94f759F1eF759', // dungeonFactory
  '0xBe46D95DB685aB3A544D321E196375B737ea6Bc4', // heroController
  '0x0Dfd9B9b25cEF61033CA680526722c8335281b8C', // itemController
  '0x84a339DDeEdC2637a14145495EDE5c55e38f1ec6', // oracle
  '0xFC2b899424B11db8d3899498989a6ff7cEAa5885', // statController
  '0x6C30D3B8739f30a9CD39cB3D5E0aa7a662f126Ef', // storyController
  '0x146dd6E8f9076dfEE7bE0b115bb165d62874d110', // treasury
  '0xAcEE7Bd17E7B04F7e48b29c0C91aF67758394f0f', // heroTokensVault
  '0x04FeaD4a7444762315B7F488353ba1E3B6dFB86b', // statReader
  '0xE6C9e172d767F9DE38Bfd391F396A02146eBe637', // multicall
  '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83', // magicToken
  '0xe4436821E403e78a6Dd62f7a9F5611f97a18f44C', // strengthToken
  '0xe4436821E403e78a6Dd62f7a9F5611f97a18f44C', // dexterityToken
  '0xfc0a5E585Ddc9bD07D5513848d1232b00F9e8264', // pawnsop
  '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83', // network token
  '0x50D8F5E54Cf0658b5568C82cEA244D2fBd97173C', // sponsored hero
);

export const FANTOM_POOLS = [
  '0xdef171fe48cf0115b1d80b88dc8eab59176fee57'.toLowerCase(),
  '0x56e837286dc7366ef6d6464d332ac6f9d32bc5a0'.toLowerCase(),
  '0x9254397549a15aefb0fba41ef34c6b06c33b1801'.toLowerCase(),
  '0x44eb7CFD34538324cCfAdf25e2D4753B57e43F91'.toLowerCase(),
  '0x1231deb6f5749ef6ce6943a275a1d3e7486f4eae'.toLowerCase()
]

export const FANTOM_SKIP_ADDRESSES = [
  '0xbbbbb8c4364ec2ce52c59d2ed3e56f307e529a94'.toLowerCase(),
  '0x000000000000000000000000000000000000000E'.toLowerCase(),
]