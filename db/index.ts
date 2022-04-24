// Local database
type TDAOEntity = {
  title: string
  token: string
  totalSupply: number
  space: string
  icon: string
}

const daos: TDAOEntity[] = [
  {
    title: '1inch',
    token: '0x111111111117dc0aa78b770fa6a738034120c302',
    totalSupply: 1_500_000_000,
    space: '1inch.eth',
    icon: 'https://token-icons.s3.amazonaws.com/0x111111111117dc0aa78b770fa6a738034120c302.png'
  },
  {
    title: 'Opium',
    token: '0x888888888889c00c67689029d7856aac1065ec11',
    totalSupply: 100_000_000,
    space: 'opiumprotocol.eth',
    icon: 'https://token-icons.s3.amazonaws.com/0x888888888889c00c67689029d7856aac1065ec11.png',
  },
  {
    title: 'Gelato',
    token: '0x15b7c0c907e4c6b9adaaaabc300c08991d6cea05',
    totalSupply: 420_690_000,
    space: 'gelato.eth',
    icon: 'https://token-icons.s3.amazonaws.com/0x15b7c0c907e4c6b9adaaaabc300c08991d6cea05.png',
  },
  {
    title: 'AAVE',
    token: '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9',
    totalSupply: 16_000_000,
    space: 'aave.eth',
    icon: 'https://token-icons.s3.amazonaws.com/0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9.png'
  },
  {
    title: 'Gearbox',
    token: '0xba3335588d9403515223f109edc4eb7269a9ab5d',
    totalSupply: 10_000_000_000,
    space: 'gearbox.eth',
    icon: 'https://assets.coingecko.com/coins/images/21630/large/gear.png',
  },
  {
    title: 'The Graph',
    token: '0xc944e90c64b2c07662a292be6244bdf05cda44a7',
    totalSupply: 10_000_000_000,
    space: 'graphprotocol.eth',
    icon: 'https://token-icons.s3.amazonaws.com/0xc944e90c64b2c07662a292be6244bdf05cda44a7.png'
  }
]

export default {
  daos
}
