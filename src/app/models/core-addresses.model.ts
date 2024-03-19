export class CoreAddressesModel {
  public readonly controller: string;
  public readonly gameToken: string;
  public readonly minter: string;
  public readonly goc: string;
  public readonly reinforcementController: string;
  public readonly dungeonFactory: string;
  public readonly heroController: string;
  public readonly itemController: string;
  public readonly oracle: string;
  public readonly statController: string;
  public readonly storyController: string;
  public readonly treasury: string;
  public readonly heroTokensVault: string;

  public readonly statReader: string;
  public readonly multicall: string;

  public readonly magicToken: string;
  public readonly strengthToken: string;
  public readonly dexterityToken: string;

  public readonly pawnshop: string;
  public readonly networkToken: string;
  public readonly sponsoredHero: string;

  constructor(
    controller: string,
    gameToken: string,
    minter: string,
    goc: string,
    reinforcementController: string,
    dungeonFactory: string,
    heroController: string,
    itemController: string,
    oracle: string,
    statController: string,
    storyController: string,
    treasury: string,
    heroTokensVault: string,
    statReader: string,
    multicall: string,
    magicToken: string,
    strenghtToken: string,
    dexterityToken: string,
    pawnshop: string,
    networkToken: string,
    sponsoredHero: string,
  ) {
    this.controller = controller;
    this.gameToken = gameToken;
    this.minter = minter;
    this.goc = goc;
    this.reinforcementController = reinforcementController;
    this.dungeonFactory = dungeonFactory;
    this.heroController = heroController;
    this.itemController = itemController;
    this.oracle = oracle;
    this.statController = statController;
    this.storyController = storyController;
    this.treasury = treasury;
    this.heroTokensVault = heroTokensVault;
    this.statReader = statReader;
    this.multicall = multicall;
    this.magicToken = magicToken;
    this.strengthToken = strenghtToken;
    this.dexterityToken = dexterityToken;

    this.pawnshop = pawnshop;
    this.networkToken = networkToken;
    this.sponsoredHero = sponsoredHero;
  }
}
