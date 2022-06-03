import { BigNumber } from 'bignumber.js';

export const WHITELISTED_POOLS: Array<{ dexAddress: string; dexId?: BigNumber }> = [
  { dexAddress: 'KT1K4EwTpbvYN9agJdjpyJm4ZZdhpUNKB3F6' }, // TEZ / KUSD
  { dexAddress: 'KT1X3zxdTzPB9DgVzA3ad6dgZe9JEamoaeRy' }, // TEZ / QUIPU
  { dexAddress: 'KT1W3VGRUjvS869r4ror8kdaxqJAZUbPyjMT' }, // TEZ / wXTZ
  { dexAddress: 'KT1KFszq8UFCcWxnXuhZPUyHT9FK3gjmSKm6' }, // TEZ / USDS
  { dexAddress: 'KT1WBLrLE2vG8SedBqiSJFm4VVAZZBytJYHc' }, // TEZ / tzBTC
  { dexAddress: 'KT1BMEEPX7MWzwwadW3NCSZe9XGmFJ7rs7Dr' }, // TEZ / STKR
  { dexAddress: 'KT1WxgZ1ZSfMgmsSDDcUn8Xn577HwnQ7e1Lb' }, // TEZ / USDtz
  { dexAddress: 'KT1Evsp2yA19Whm24khvFPcwimK6UaAJu8Zo' }, // TEZ / ETHtz
  { dexAddress: 'KT1QxLqukyfohPV5kPkw97Rs6cw1DDDvYgbB' }, // TEZ / hDAO
  { dexAddress: 'KT1FG63hhFtMEEEtmBSX2vuFmP87t9E7Ab4t' }, // TEZ / WRAP
  { dexAddress: 'KT1RRgK6eXvCWCiEGWhRZCSVGzhDzwXEEjS4' }, // TEZ / CRUNCH
  { dexAddress: 'KT1Lvtxpg4MiT2Bs38XGxwh3LGi5MkCENp4v' }, // TEZ / wAAVE
  { dexAddress: 'KT1UMAE2PBskeQayP5f2ZbGiVYF7h8bZ2gyp' }, // TEZ / wBUSD
  { dexAddress: 'KT1KuV43iebbbrkBMGov2QMgAbsnAksx6ncW' }, // TEZ / wCEL
  { dexAddress: 'KT1DA8NH6UqCiSZhEg5KboxosMqLghwwvmTe' }, // TEZ / wCOMP
  { dexAddress: 'KT1GSjkSg6MFmEMnTJSk6uyYpWXaEYFahrS4' }, // TEZ / wCRO
  { dexAddress: 'KT1PQ8TMzGMfViRq4tCMFKD2QF5zwJnY67Xn' }, // TEZ / wDAI
  { dexAddress: 'KT1SzCtZYesqXt57qHymr3Hj37zPQT47JN6x' }, // TEZ / wFTT
  { dexAddress: 'KT1GsTjbWkTgtsWenM6oWuTuft3Qb46p2x4c' }, // TEZ / wHT
  { dexAddress: 'KT1AN7BBmeSUN5eDDQLEhWmXv1gn4exc5k8R' }, // TEZ / wHUSD
  { dexAddress: 'KT1MpRQvn2VRR26VJFPYUGcB8qqxBbXgk5xe' }, // TEZ / wLEO
  { dexAddress: 'KT1Lpysr4nzcFegC9ci9kjoqVidwoanEmJWt' }, // TEZ / wLINK
  { dexAddress: 'KT1RsfuBee5o7GtYrdB7bzQ1M6oVgyBnxY4S' }, // TEZ / wMATIC
  { dexAddress: 'KT1MaefGJRtu57DiVhQNEjYgTYok3X71iEDj' }, // TEZ / wMKR
  { dexAddress: 'KT1NQyNPXmjYktNBDhYkBKyTGYcJSkNbYXuh' }, // TEZ / wOKB
  { dexAddress: 'KT1Ca5FGSeFLH3ugstc5p56gJDMPeraBcDqE' }, // TEZ / wPAX
  { dexAddress: 'KT1Lotcahh85kp878JCEc1TjetZ2EgqB24vA' }, // TEZ / wSUSHI
  { dexAddress: 'KT1Ti3nJT85vNn81Dy5VyNzgufkAorUoZ96q' }, // TEZ / wUNI
  { dexAddress: 'KT1U2hs5eNdeCpHouAvQXGMzGFGJowbhjqmo' }, // TEZ / wUSDC
  { dexAddress: 'KT1T4pfr6NL8dUiz8ibesjEvH2Ne3k6AuXgn' }, // TEZ / wUSDT
  { dexAddress: 'KT1DksKXvCBJN7Mw6frGj6y6F3CbABWZVpj1' }, // TEZ / wWBTC
  { dexAddress: 'KT1DuYujxrmgepwSDHtADthhKBje9BosUs1w' }, // TEZ / wWETH
  { dexAddress: 'KT1X1LgNkQShpF9nRLYw3Dgdy4qp38MX617z' }, // TEZ / PLENTY
  { dexAddress: 'KT1J3wTYb4xk5BsSBkg6ML55bX1xq7desS34' }, // TEZ / KALAM
  { dexAddress: 'KT1FHiJmJUgZMPtv5F8M4ZEa6cb1D9Lf758T' }, // TEZ / crDAO
  { dexAddress: 'KT1Gdix8LoDoQng7YqdPNhdP5V7JRX8FqWvM' }, // TEZ / SMAK
  { dexAddress: 'KT1NEa7CmaLaWgHNi6LkRi5Z1f4oHfdzRdGA' }, // TEZ / kDAO
  { dexAddress: 'KT1EtjRRCBC2exyCRXz8UfV7jz7svnkqi7di' }, // TEZ / uUSD
  { dexAddress: 'KT1H8sJY2VzrbiX4pYeUVsoMUd4iGw2DV7XH' }, // TEZ / uDEFI
  { dexAddress: 'KT1DssMzoSr8fnUUq1WxeSuHfLG4gzS7pgge' }, // TEZ / bDAO
  { dexAddress: 'KT1PL1YciLdwMbydt21Ax85iZXXyGSrKT2BE' }, // TEZ / YOU
  { dexAddress: 'KT1B7NqoQQkALYPS9fdxrcjGMQST6Wv4yy3h' }, // TEZ / RCKT
  { dexAddress: 'KT1ANY7962FTf2RqJMMF4paZkuTQA77994yv' }, // TEZ / rkDAO
  { dexAddress: 'KT1Cq3pyv6QEXugsAC2iyXr7ecFqN7fJVTnA' }, // TEZ / UNO
  { dexAddress: 'KT1LuXT6jZPhUH1qCnSUqAzFedjoBwePLQnF' }, // TEZ / GIF
  { dexAddress: 'KT18rJtJNmwTfbJMinWqHzpkLeBQa4BVqGoJ' }, // TEZ / IDZ
  { dexAddress: 'KT1QHbWZPsXK8rpKkudNLmx4VVvgHvGqjnwP' }, // TEZ / EASY
  { dexAddress: 'KT1UzjhUhau9g5MjPxKUzM6KRJNwdW1oo52G' }, // TEZ / INSTA
  { dexAddress: 'KT1B4UQTW1P8kgasbbmEPUeaEQF68mPxMpc8' }, // TEZ / xPLENTY
  { dexAddress: 'KT1FbYwEWU8BTfrvNoL5xDEC5owsDxv9nqKT' }, // TEZ / ctez
  { dexAddress: 'KT1K8A8DLUTVuHaDBCZiG6AJdvKJbtH8dqmN' }, // TEZ / PAUL
  { dexAddress: 'KT1Eg2QesN1tCzScTrvoeKm5W67GgjV32McR' }, // TEZ / SPI
  { dexAddress: 'KT1VXBX6NwapYf9Sq6LsQVr4SdsDq3ta1nss' }, // TEZ / WTZ
  { dexAddress: 'KT1Q93ftAUzvfMGPwC78nX8eouL1VzmHPd4d' }, // TEZ / FLAME
  { dexAddress: 'KT1BweorZK1CJDEu76SyKcxfzeiAxip73Kot' }, // TEZ / fDAO
  { dexAddress: 'KT1UJ1hVTdiUen7H3zk1CXGC7PbANb57VkS4' }, // TEZ / PXL
  { dexAddress: 'KT1PrRTVNgxkRgyqqNQvwTiVhd55dqyxXJ6n' }, // TEZ / sDAO
  { dexAddress: 'KT1Qej1k8WxPvBLUjGVtFXStgzQtcx3itSk5' }, // TEZ / akaDAO
  { dexAddress: 'KT1H5YwfF6nmFZavwzftddbcfxAXmbGhyDCY' }, // TEZ / MIN
  { dexAddress: 'KT1GxxLmBC7tfx4Enpe5YLaCXppAKKfzNRYF' }, // TEZ / ENR
  { dexAddress: 'KT1JAgJC6FTJ9SzGGits8GVonCr8cfFp5HGV' }, // TEZ / MCH
  { dexAddress: 'KT1Ao9HNxW9tqGMAvAMGyvP36VhJEUGWVRpx' }, // TEZ / uBTC
  { dexAddress: 'KT1FptuULGK69mZRsBz62CSFdRs52etEb6Ah' }, // TEZ / MTRIA
  { dexAddress: 'KT1Ucg1fTZXBD8P426rTRXyu7YQUgYXV7RVu' }, // TEZ / DOGA
  { dexAddress: 'KT1VNEzpf631BLsdPJjt2ZhgUitR392x6cSi', dexId: new BigNumber('4') }, // KUSD / QUIPU
  { dexAddress: 'KT1VNEzpf631BLsdPJjt2ZhgUitR392x6cSi', dexId: new BigNumber('0') }, // KUSD / CRUNCH
  { dexAddress: 'KT1VNEzpf631BLsdPJjt2ZhgUitR392x6cSi', dexId: new BigNumber('32') }, // KUSD / PLENTY
  { dexAddress: 'KT1VNEzpf631BLsdPJjt2ZhgUitR392x6cSi', dexId: new BigNumber('16') }, // KUSD / uUSD
  { dexAddress: 'KT1VNEzpf631BLsdPJjt2ZhgUitR392x6cSi', dexId: new BigNumber('35') }, // KUSD / uBTC
  { dexAddress: 'KT1VNEzpf631BLsdPJjt2ZhgUitR392x6cSi', dexId: new BigNumber('34') }, // KUSD / DOGA
  { dexAddress: 'KT1VNEzpf631BLsdPJjt2ZhgUitR392x6cSi', dexId: new BigNumber('15') }, // QUIPU / tzBTC
  { dexAddress: 'KT1VNEzpf631BLsdPJjt2ZhgUitR392x6cSi', dexId: new BigNumber('13') }, // QUIPU / wAAVE
  { dexAddress: 'KT1VNEzpf631BLsdPJjt2ZhgUitR392x6cSi', dexId: new BigNumber('36') }, // QUIPU / wBUSD
  { dexAddress: 'KT1VNEzpf631BLsdPJjt2ZhgUitR392x6cSi', dexId: new BigNumber('9') }, // QUIPU / wDAI
  { dexAddress: 'KT1VNEzpf631BLsdPJjt2ZhgUitR392x6cSi', dexId: new BigNumber('17') }, // QUIPU / wWBTC
  { dexAddress: 'KT1VNEzpf631BLsdPJjt2ZhgUitR392x6cSi', dexId: new BigNumber('2') }, // QUIPU / PLENTY
  { dexAddress: 'KT1VNEzpf631BLsdPJjt2ZhgUitR392x6cSi', dexId: new BigNumber('3') }, // QUIPU / kDAO
  { dexAddress: 'KT1VNEzpf631BLsdPJjt2ZhgUitR392x6cSi', dexId: new BigNumber('7') }, // QUIPU / uUSD
  { dexAddress: 'KT1VNEzpf631BLsdPJjt2ZhgUitR392x6cSi', dexId: new BigNumber('6') }, // QUIPU / YOU
  { dexAddress: 'KT1VNEzpf631BLsdPJjt2ZhgUitR392x6cSi', dexId: new BigNumber('1') }, // QUIPU / PAUL
  { dexAddress: 'KT1VNEzpf631BLsdPJjt2ZhgUitR392x6cSi', dexId: new BigNumber('20') }, // QUIPU / FLAME
  { dexAddress: 'KT1VNEzpf631BLsdPJjt2ZhgUitR392x6cSi', dexId: new BigNumber('39') }, // QUIPU / DOGA
  { dexAddress: 'KT1VNEzpf631BLsdPJjt2ZhgUitR392x6cSi', dexId: new BigNumber('42') }, // tzBTC / wWETH
  { dexAddress: 'KT1VNEzpf631BLsdPJjt2ZhgUitR392x6cSi', dexId: new BigNumber('12') }, // CRUNCH / crDAO
  { dexAddress: 'KT1VNEzpf631BLsdPJjt2ZhgUitR392x6cSi', dexId: new BigNumber('8') }, // wBUSD / wDAI
  { dexAddress: 'KT1VNEzpf631BLsdPJjt2ZhgUitR392x6cSi', dexId: new BigNumber('10') }, // wUSDC / crDAO
  { dexAddress: 'KT1VNEzpf631BLsdPJjt2ZhgUitR392x6cSi', dexId: new BigNumber('47') }, // PLENTY / ctez
  { dexAddress: 'KT1VNEzpf631BLsdPJjt2ZhgUitR392x6cSi', dexId: new BigNumber('11') }, // crDAO / uUSD
  { dexAddress: 'KT1VNEzpf631BLsdPJjt2ZhgUitR392x6cSi', dexId: new BigNumber('19') }, // crDAO / PAUL
  { dexAddress: 'KT1VNEzpf631BLsdPJjt2ZhgUitR392x6cSi', dexId: new BigNumber('40') }, // kDAO / uUSD
  { dexAddress: 'KT1VNEzpf631BLsdPJjt2ZhgUitR392x6cSi', dexId: new BigNumber('41') }, // kDAO / YOU
  { dexAddress: 'KT1VNEzpf631BLsdPJjt2ZhgUitR392x6cSi', dexId: new BigNumber('29') }, // uUSD / YOU
  { dexAddress: 'KT1VNEzpf631BLsdPJjt2ZhgUitR392x6cSi', dexId: new BigNumber('21') }, // uUSD / uBTC
  { dexAddress: 'KT1VNEzpf631BLsdPJjt2ZhgUitR392x6cSi', dexId: new BigNumber('33') }, // uUSD / DOGA
  { dexAddress: 'KT1VNEzpf631BLsdPJjt2ZhgUitR392x6cSi', dexId: new BigNumber('5') } // ctez / WTZ
];
