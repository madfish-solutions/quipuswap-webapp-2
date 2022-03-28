import { ContractAbstraction, ContractProvider, Wallet } from "@taquito/taquito";

export type Contract = ContractAbstraction<ContractProvider | Wallet>;
