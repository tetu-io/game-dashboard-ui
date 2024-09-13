import { CoreAddressesModel } from '../../models/core-addresses.model';
import { TokenInfo } from './addresses.constant';

export const REAL_CORE = new CoreAddressesModel(
  '0x6ce857d3037e87465b003aCbA264DDF2Cec6D5E4', // controller
  '0x6B2e0fACD2F2A8f407aC591067Ac06b5d29247E4', // gameToken
  '0x6f2fb669B52e4ED21a019e9db197F27f4B88eBf9', // minter
  '0xeFBc16b8c973DecA383aAAbAB07153D2EB676556', // goc
  '0xC363F3D4e1C005bf5321040653A088F71Bb974Ab', // reinforcementController
  '0xa4EB2E1284D9E30fb656Fe6b34c1680Ef5d4cBFC', // dungeonFactory
  '0x0C6868831c504Fb0bB61A54FEfC6464804380508', // heroController
  '0x75e1e98650c119c4E3dCE3070CE6A5397Ed70c6a', // itemController
  '0xCF66857b468740d6dbF9cE11929A9c03DDA12988', // oracle
  '0xC423D7e3e1B7caF1AA5ce58EA0f3A91427Fd47ae', // statController
  '0xA60205802E1B5C6EC1CAFA3cAcd49dFeECe05AC9', // storyController
  '0xd0C1378c177E961D96c06b0E8F6E7841476C81Ef', // treasury
  '0xB393cA1442621c3356600e5B10B3510B5180d948', // heroTokensVault
  '0x5373C3d09C39D8F256f88E08aa61402FE14A3792', // statReader
  '0xB5A5D5fE893bC26C6E70CEbb8a193f764A438fd5', // multicall
  '0x6B2e0fACD2F2A8f407aC591067Ac06b5d29247E4', // magicToken
  '0x6B2e0fACD2F2A8f407aC591067Ac06b5d29247E4', // strengthToken
  '0x6B2e0fACD2F2A8f407aC591067Ac06b5d29247E4', // dexterityToken

  '0x82A9F7bD894856DB513f6aeC982a28768aeF0a60', // pawnsop
  '0x90c6E93849E06EC7478ba24522329d14A5954Df4', // network token
  '0x6F23dC46dCa3F08D625b48e0C7735aeC32FB234b', // sponsored hero
);

export const REAL_TOKEN_INFO = new Map<string, TokenInfo>([
  [REAL_CORE.gameToken.toLowerCase(), { symbol: 'SACRA', decimals: 18 }],
  [REAL_CORE.networkToken.toLowerCase(), { symbol: 'reETH', decimals: 18 }],
]);

export const REAL_ITEMS = {
  SACRA_CONS_1_ITEM: '0x8c6DD7a9aCc471A4Ad84B33ad82669d84983676a',
  SACRA_CONS_2_ITEM: '0x8018BA5E6C05c51E5433123e392334B63a0B6D02',
  SACRA_CONS_3_ITEM: '0x476E7652a081F749856cAeC1E2aBF563b52AEEEa',
  SACRA_CONS_4_ITEM: '0x7205f558b482616F83208951B579580664a2dc58',
  SACRA_CONS_17_ITEM: '0x28dd380AE092Df7D950c9e1FD0AA306063267503',
  SACRA_CONS_18_ITEM: '0x3870B1cB4F83Cc3910106178f6B6310de100e9C9',
  SACRA_CONS_19_ITEM: '0xaB113b174D3AdEf7f72d30de532Daf368efaC7ff',
  SACRA_CONS_20_ITEM: '0x6B8dea6cBe9CC5d70384ba223839e8a5dD8ae7c1',
  SACRA_CONS_21_ITEM: '0x67689281BD2aA5F7611C80E4Ad6174d39e600208',
  SACRA_CONS_27_ITEM: '0x91a97bB6Cb3abe7eBc788628d1798d7cA737821f',
  SACRA_CONS_28_ITEM: '0x9c0D22325a1A198C892d3b366bC65FF380fD031A',
  SACRA_CONS_29_ITEM: '0x98F76f92D9De7e5a333Fc9B6438eB3A2a3B58E2a',
  SACRA_CONS_30_ITEM: '0x7C2D478E0c7DBe91f9FaBa0d64107362438b2975',
  SACRA_CONS_31_ITEM: '0x2c843E75BaF9AfD52CF5e0f9cb547aA85a131B34',
  SACRA_CONS_32_ITEM: '0x708137a379D2bC067F6553396AD528FF9a00f1D3',
  SACRA_CONS_33_ITEM: '0xe2BB405731B61420b66eA754203FA01C81A8A609',
  SACRA_CONS_34_ITEM: '0x32f7C3a5319A612C1992f021aa70510bc9F16161',
  SACRA_CONS_35_ITEM: '0x3E75231c1cc0E6D30d03346B3B87B92Bb3a1F856',
  SACRA_HELM_1_ITEM: '0x6E4D8CAc827B52E7E67Ae8f68531fafa36eaEf0B',
  SACRA_HELM_6_ITEM: '0xc4B7b554af7a82595e7e6Fab932562d5d2e273b4',
  SACRA_BODY_1_ITEM: '0x5391aB3C930bc0b5a1305d4349bF3A0C52c704AE',
  SACRA_GLOVES_1_ITEM: '0x85EC55D9112A2635BE472B6A77DF720d3879683D',
  SACRA_GLOVES_6_ITEM: '0xb454F31105b4c7b3F6C89b8B5216620ea2b34A80',
  SACRA_BELT_1_ITEM: '0x608430e4722a5f7b0e7445FE57D004209C70e9F4',
  SACRA_AMULET_1_ITEM: '0x3a91e7E276936dE80AeD4c2498954921bD107dB7',
  SACRA_AMULET_2_ITEM: '0xa4320b575e86cFa06379B8eD8C76d9149A30F948',
  SACRA_AMULET_12_ITEM: '0x2C606E0DA0A10d2445Be1f32BA8d08F8364B08fF',
  SACRA_RING_1_ITEM: '0xC43Bc5DC137D1FC25a06aBC2b397Af07216eF5F6',
  SACRA_RING_2_ITEM: '0x74DB094e0342190bE850F339c876F8E21B242847',
  SACRA_RING_9_ITEM: '0x0C27719A3EdC8F3F1E530213c33548456f379892',
  SACRA_OFF_1_ITEM: '0x6efecCc5112c778bD3bA6ce496Cc6816aBbE187C',
  SACRA_OFF_2_ITEM: '0x61b4eD54d8c70e8e692Ad4e5BD31224dDb8BC540',
  SACRA_OFF_10_ITEM: '0xf6E610826a8A4fe24c76232C1541C64Ddf928821',
  SACRA_BOOTS_1_ITEM: '0x9D2375e1A429AcFdc9cc8936ea851FF4332315cA',
  SACRA_BOOTS_5_ITEM: '0x6C87fa39CC7C275dd9f4907B8C5a643D384ED66e',
  SACRA_OHW_1_ITEM: '0xe32051306862B66d958c457C83dA20BD89760fb1',
  SACRA_OHW_2_ITEM: '0x0004fC5B1742ABC768D048Ce7906Eef2e8916eF2',
  SACRA_OHW_3_ITEM: '0x2b7B097b23E0daB93e881a6471cF8b511f14E1F4',
  SACRA_THW_1_ITEM: '0xA0F8ac8Da6Fc9dbf2BD2e0061818D6E71daa75e4',
  SACRA_THW_2_ITEM: '0x953fa8eF9a5a7B58B398212C702B170B00175Bde',
  SACRA_FEAR_ITEM: '0x57577b27814f4166E2340580C49c9726549677e0',
  SACRA_DEMON_SPEED_ITEM: '0xf61eb06C7d575386947aABbA5A5170ec4eD503Cb',
  SACRA_BRUTE_FORCE_ITEM: '0x53584E5E0E96331cedBBf1cC11e667d2926685F6',
  SACRA_SAVAGE_CHARM_ITEM: '0x166df927779eD5086b716BEB4180e289496879F7',
  SACRA_GOLDEN_EYE_ITEM: '0x3BeD2aC458C6eb073639Bc6694c0c9d02e0B07B7',
  SACRA_SABBAH_POISON_ITEM: '0xf013e56c8eB61Af4c37Cb674D5B313dEE5187Dc1',
  SACRA_SPIT_IN_FACE_ITEM: '0x373f414a596Bb6cB9Abf74b61b1c59F910759287',
  SACRA_ONSLAUGHT_ITEM: '0xfA9316343525455F394bc2A391C579F1A5584415',
  SACRA_STRONG_BLOCK_ITEM: '0x8E26101F11e43BD6d6b3A84E3A32e8194953A123',
  SACRA_BEEF_PATTY_ITEM: '0x5947868a6842e69Cacad068AbF6481e1F522063E',
  SACRA_HEAT_STRIKE_ITEM: '0xae1C06bb4c68391E6775EEa195f1ae34c9D7F947',
  SACRA_STATIC_DISCHARGE_ITEM: '0x4905A8fEa4386a095E17BE5DDA57B61f248c19d7',
  SACRA_CONS_5_ITEM: '0x6eEFe56159B5fE6626541CB55744C50B5FbA59D6',
  SACRA_CONS_6_ITEM: '0xFEa82d6d53597109465FF864360Bd79635b11655',
  SACRA_CONS_7_ITEM: '0xb4E5FF95c647BA5fDdFB1ea0d634A618be72371c',
  SACRA_CONS_8_ITEM: '0xcEd6998485B1cc3f47Bbc80f7456cdB9B02bf8e1',
  SACRA_CONS_22_ITEM: '0xC4Ea3ca488b9E9c648d6217ea5d988774a5B389b',
  SACRA_HELM_2_ITEM: '0x24f0Ba229a7E7B1A89AbDf0B4824A7cdaAdd6a1c',
  SACRA_HELM_7_ITEM: '0x91aB05f1da222A74CeaCCD895FEe011749ce0C1C',
  SACRA_BODY_2_ITEM: '0x9B836e138f264c36e62471c7b8bfe7687BCA67E7',
  SACRA_BODY_6_ITEM: '0xc58D1d090E996F3A907eBd73f25249b25f81d401',
  SACRA_GLOVES_2_ITEM: '0x25e704238d8810619Cc24148227E0Cf996E90291',
  SACRA_GLOVES_7_ITEM: '0x6eaCC32119e988d0C1d16A1Dc493D01319998F94',
  SACRA_BELT_2_ITEM: '0xf8aBE5bEA00982731a8Cf492DDedf1519cbC4470',
  SACRA_AMULET_3_ITEM: '0xBF2FCD9B7Edaa4d104f16EAe1e32Cf73d1e86463',
  SACRA_AMULET_4_ITEM: '0x90eb779AaB7cD8bF531F72C895B6C743D316C951',
  SACRA_AMULET_9_ITEM: '0xC80807F075Cb76139678De3954D4F7f159829Bf9',
  SACRA_RING_3_ITEM: '0x062C79E49a05B017ee24bE63168f96425908bfbE',
  SACRA_RING_4_ITEM: '0xCE0575DE6953A1a8C740B221d62086fB289236CC',
  SACRA_RING_10_ITEM: '0xc1B2F4c8a797600327dF2923474126a07a5963f4',
  SACRA_OFF_3_ITEM: '0xb15BBa331F4deA01Aa8479fc55544Dc8f0Ff3f36',
  SACRA_OFF_4_ITEM: '0x4639e6302CEe3188d51390EB28D2082d0AC5EdC3',
  SACRA_OFF_11_ITEM: '0x34AB461fE2B3E0fd8Ba6249b0611732b0F8BA447',
  SACRA_BOOTS_2_ITEM: '0x6c61c63066DcfA0dB4906953DaEcC605Fdf73A58',
  SACRA_OHW_4_ITEM: '0x750bA01724f1D7b08D021bB05E7d543B2eC01d05',
  SACRA_OHW_5_ITEM: '0xc96f5b63CE8F188C048ee5f3F513505E4B9F059d',
  SACRA_OHW_6_ITEM: '0x5E427A2BD4Da38234C6EBAD7A64d7d0007D02382',
  SACRA_THW_3_ITEM: '0x713DF40F222d36d557e1A66f6F79fDbC0a78457D',
  SACRA_THW_4_ITEM: '0xfD5EB3a77B0263271713758AD88A43022E04afEA',
  SACRA_THW_5_ITEM: '0x631DA2Fb619Fe49E96758A9c15f87f482A31Ec3a',
  SACRA_STEEL_SKIN_ITEM: '0x242c6BB40Efa44729683c0f372ba9a54baa485A6',
  SACRA_LIFEDRAIN_ITEM: '0xBB2A9DF2484427f4afA9045d834744c73Dc5AF60',
  SACRA_FROSTBITE_ITEM: '0xf62DC67dd2B8c5a7Cdbb1f3C08aF99E08091fc03',
  SACRA_LIKE_A_PUSSY_ITEM: '0xD5a3F5AaA79813eAFE395F10905187831BAed613',
  SACRA_RAGE_ITEM: '0x5ED3905f29Ec134C45A758dB2943227BfDc74d77',
  SACRA_DEAD_STRIKE_ITEM: '0x7B4A9A5EC0B12bb9c062EA7D82a0C8b69cBC6da5',
  SACRA_FIRM_HAND_ITEM: '0xBb9BD59AF4A5c2a573F5DA0375982Af474411557',
  SACRA_JUSTICE_ITEM: '0x781D5b681Ad5f45Be731742e51A89B659DF25539',
  SACRA_STEP_BACK_ITEM: '0xCefA92388A8e558817DEd97F6613FC993926FA5b',
  SACRA_PATIENCE_ITEM: '0xe6603387Ba172C07ef8e4ca8cB124156779021F9',
  SACRA_TIME_AND_EXPERIENCE_ITEM: '0x0a4Ed882FD66B2C4eEC49FB16C56C9fe2b97b9E7',
  SACRA_MELT_ITEM: '0xAEb004B73289D685D72705955179ae216eAf7639',
  SACRA_ICE_SHARD_ITEM: '0x3c055f4a2B7234a4D807a29244403B5A44648a1F',
  SACRA_CONS_9_ITEM: '0xce8BF28E019b1Cf98BE93487c9733F55Fc65eCab',
  SACRA_CONS_10_ITEM: '0x65Be5bd1745A9871a5f042385dB869e78e9A1693',
  SACRA_CONS_11_ITEM: '0xA00726579eCA409324D52D2dBBFFa69B3Ad19bb5',
  SACRA_CONS_12_ITEM: '0x1C8F4e0b739090De64D0C33c89950CEc791AC7AF',
  SACRA_CONS_23_ITEM: '0x57C8aFbDeBe5773BF5dc533FBdB5758DfF277753',
  SACRA_CONS_24_ITEM: '0x511558267815Ec9C0592C3039Efaaba2c5F35CC0',
  SACRA_HELM_3_ITEM: '0x4C8a0Ba0cB03CedbcAA24A46C9a347FCbD97Af09',
  SACRA_HELM_8_ITEM: '0xce1A342a3AaB8e1A6e1879D94769B374d8eb07Fb',
  SACRA_BODY_3_ITEM: '0x2856FC1a5119a84033869cCea59B1C8062B88e81',
  SACRA_BODY_7_ITEM: '0x63290e79760E441E9228C5308E8ff7De50843c20',
  SACRA_GLOVES_3_ITEM: '0x9aD3Bd13A8919DE524Aae39362464aB6Ca421c0D',
  SACRA_GLOVES_8_ITEM: '0x9db2b9236876cea73a60D986AF24A2F02069d0e4',
  SACRA_BELT_3_ITEM: '0x40E30Bc64fA52728c1f693d5553e74C4b1D558eA',
  SACRA_AMULET_5_ITEM: '0xFB6A440af0bbBAd0cC5f24323c7Df9d400084a12',
  SACRA_AMULET_6_ITEM: '0x49ed924c67De54362bD7683D502eb4BC99ED8b2D',
  SACRA_AMULET_10_ITEM: '0xbf743E4f4cDE4FF116a00a443a97F6fF54b423cd',
  SACRA_AMULET_11_ITEM: '0xC1d8804fF5DF18058e9b804890053e3d686c7c79',
  SACRA_RING_5_ITEM: '0x06A52cd7aA76184EfF8fE8Ceb0e1b3603E9D3b29',
  SACRA_RING_6_ITEM: '0x3A520A4217513AdF4a67b8e19e5a1Ba73a2c8dC0',
  SACRA_OFF_5_ITEM: '0x96958716535B5bE8e6C9Bb9a57dc8731efea1019',
  SACRA_OFF_6_ITEM: '0xff24f83b3B8891c8eEdB2dCB6b5915AE5a92dc2F',
  SACRA_BOOTS_3_ITEM: '0xBD4b1E234A616B10D418034BEc4da6Fa5A3fA481',
  SACRA_BOOTS_6_ITEM: '0x5EA63860CFF7062dc9799CEC9c173B3B36D98e1e',
  SACRA_OHW_7_ITEM: '0xCa360F0242Ba5add0AC72C16E5d6CDC317ac7194',
  SACRA_OHW_8_ITEM: '0xFc09177DCfE9e5Fc3Fb653d64436A8a4f6fE7Ebc',
  SACRA_OHW_9_ITEM: '0xDe3e33F2c48451e18b14fCE5276c76004bCfF306',
  SACRA_OHW_12_ITEM: '0xDe9E1EdC5066224eE5f32bE31D95779e9686476E',
  SACRA_OHW_13_ITEM: '0x8f7FBF129867c2a96D34b7612Eb85bC347793aFf',
  SACRA_OHW_14_ITEM: '0x99782985E63f25C33e746EfE09231D257F69e24B',
  SACRA_THW_6_ITEM: '0x043C9d9Fd347462BcE1DaF53D94416be9180A552',
  SACRA_THW_7_ITEM: '0x73afa8dAFE243f0491bBDd945DB7E326bb075154',
  SACRA_THW_10_ITEM: '0x6beC148D490658D543E7E9dD5e659A4786fd572f',
  SACRA_PARALYZE_ITEM: '0x9aD77Bf475cf9c2df8198Bce7AB5B26d309f5526',
  SACRA_GUIDING_LIGHT_ITEM: '0x9C966ED06d23845632F035519a0961cd58269e2e',
  SACRA_GUT_PUNCH_ITEM: '0x6C623841312C6e9896e55Ce04095dA05AB9688E8',
  SACRA_LAST_DANCE_ITEM: '0xD28751cfd4544c95Ef8ec34e00b200D1CA3F545e',
  SACRA_I_SURVIVE_ITEM: '0x221A8b65FD739F3af1495Ab61B9f9eD6b2c78E4f',
  SACRA_ARMOR_OF_FAITH_ITEM: '0x10107fC59E0F7f0Ed6481fdB3911792b4d520A6C',
  SACRA_THUNDERBOLT_ITEM: '0x2eCE6Dac63E84C1D8C02b8b0aaC67b2FAfF61057',
  SACRA_CONS_13_ITEM: '0x4f4D57D53E5D4dE86040696cB9F7Ed4592f2D3B4',
  SACRA_CONS_14_ITEM: '0xCb7EcC5f81D90DE6DDb1071Daa48d5B4C4F7ED2F',
  SACRA_CONS_15_ITEM: '0x3D00698D224545474e3F80207565e742415b4c6f',
  SACRA_CONS_16_ITEM: '0x491A4A528A1cAd9bd5Fb6a40716A10408Db176b3',
  SACRA_CONS_25_ITEM: '0x2d0C70BE9145cd7929831E7BE3001a01a30dfA91',
  SACRA_CONS_26_ITEM: '0x3745c36E3Dd69B16b2194Ba2f23576E37Bc30b83',
  SACRA_HELM_4_ITEM: '0xF251f34d6DF569f747270427AdcDbF4053933897',
  SACRA_HELM_5_ITEM: '0x1473Ae2364f0C02f1CD2Ceaf8f0a54eF7AeAd6A1',
  SACRA_BODY_4_ITEM: '0x7cCbb7470d95BCbb8f68B09725962BD56E83C69a',
  SACRA_BODY_5_ITEM: '0xFd0BcEeE9a478140922612a1489b656b93716Bbf',
  SACRA_GLOVES_4_ITEM: '0xF812423e4070B447AD899916816ec54F930f53d2',
  SACRA_GLOVES_5_ITEM: '0xa5480737acF3de2cCa207d8820268114E246a063',
  SACRA_BELT_4_ITEM: '0x19d56A672D5006f47E50a0a9f6a459D89b51560f',
  SACRA_AMULET_7_ITEM: '0x937Be7EC5Ab3381F7Ea17D33661cFaf49a44a956',
  SACRA_AMULET_8_ITEM: '0x105912763C2F1Fa1952B9938D233525A91F28293',
  SACRA_RING_7_ITEM: '0x623C8C56A8D57E364F2e194c7656E8DB4f7AE8E9',
  SACRA_RING_8_ITEM: '0x622b28Fe2F8aAaFcd0Ed4e053Fd33D1c0fb47FEc',
  SACRA_OFF_7_ITEM: '0x4b2e763aDd7100981b2E7A220830F4C74b85700D',
  SACRA_OFF_8_ITEM: '0xA9e819352C1Eb51d6C64E953BF37B7f5787B9947',
  SACRA_OFF_9_ITEM: '0xA901749607fA32BBEE5108F7E62bb85B7B331b3B',
  SACRA_OFF_12_ITEM: '0x5737D53cdDB8b4bcAFbb9eF54a6d14BDf7EB3500',
  SACRA_OFF_13_ITEM: '0x2698C5686c3cfC8FFeEC90fe98D351Ac271Cfb8B',
  SACRA_BOOTS_4_ITEM: '0xbC7cDB9d23633E41F0f42c7e7904F627D120066B',
  SACRA_BOOTS_7_ITEM: '0x5A4aB2C545472C6fC2c9490551fe881c94b29866',
  SACRA_OHW_10_ITEM: '0x8450D9fea13AF63029d124E6F64e968BF5F4C498',
  SACRA_OHW_11_ITEM: '0x385A81966ad5D00da556fE7F1eE59c24b5e2eF45',
  SACRA_THW_8_ITEM: '0xA7298B60e4472e03DD4944892cC43D12ADD9f9bd',
  SACRA_THW_9_ITEM: '0x054Ac16Be2656fb04D1d1aCe81D9af7CEdF239BB',
  SACRA_THW_11_ITEM: '0xd659Eb1112bFa6B464C88191e29eAf4BC471F293',
  SACRA_REFLECTION_ITEM: '0xa91D678f91A437D77cC746ea29A17cA7168E0eDB',
  SACRA_SCARLET_BRANCH_ADEPT_ITEM: '0xaA4e039Ed81C8f54e0aCEbE7bFB34D1C832Fed3f',
  SACRA_ANATHEMA_ITEM: '0xF1B8dDA33513197BAa01Df73Abe308d9b52933cE',
  SACRA_GIANTS_BLOOD_ITEM: '0xE8B5f3524a8E6b9277A262F607d762730aff4565',
  SACRA_BACKSTAB_ITEM: '0x2eE904ddD8A0c38Dc9C0996aa9c49aCf39503C85',
  SACRA_VETERAN_CONFIDENCE_ITEM: '0x41F8C2Bf0947614C786E81da828FC5bea03335e4',
  SACRA_LIVE_FORTRESS_ITEM: '0xa7738b669304A5A486ED71Fc5AD7068Be979dC5B',
  SACRA_COLD_SHOULDER_ITEM: '0x1975CbeFf56e35dBf09624674f0425d44cB9C052',
  SACRA_ERASE_ITEM: '0xE4b6B193dfC8b480D1A97FfA5abfD09073436DFa',
};

export const REAL_DEX = {
  QUOTER_V2: '0xDe43aBe37aB3b5202c22422795A527151d65Eb18',
  SWAP_ROUTER_V2: '0xa1F56f72b0320179b01A947A5F78678E8F96F8EC',
  NATIVE_USDC_POOL: '0x5dfa942B42841Dd18883838D8F4e5f7d8CEb5Eeb',
};

export const REAL_POOLS = [
  '0x2EC05Ab55867719f433d8ab0a446C48003B3BE8F'.toLowerCase(),
]

export const REAL_SKIP_ADDRESSES = [
  '0x0644141dd9c2c34802d28d334217bd2034206bf7'.toLowerCase(),
  '0x000000000000000000000000000000000000000E'.toLowerCase(),
  ]