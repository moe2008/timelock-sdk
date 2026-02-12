import type { Address } from "viem";

export type AddressBook = Record<number, Address>;

export const TIMELOCK_ADDRESSES: AddressBook = {
    11155111: "0x2a12474d1a4224eebf407b09f818aafbed7be2a8" as Address, // Sepolia
    // 1: "0x..." as Address,        // Mainnet
    31337: "0x5fbdb2315678afecb367f032d93f642f64180aa3" as Address,    // Local
};

export function getTimelockAddress(chainId: number, book: AddressBook = TIMELOCK_ADDRESSES): Address {
    const addr = book[chainId];
    if (!addr) throw new Error(`No TimeLockContent address configured for chainId=${chainId}`);
    return addr;
}
