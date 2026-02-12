import { decodeErrorResult } from "viem";
import { ABI as timeLockContentAbi } from "@webdrei/timelock-content-contracts";

export type TimeLockErrorName =
    | "NotFound"
    | "NotSeller"
    | "RevealTooEarly"
    | "AlreadyRevealed"
    | "BadReveal"
    | "WrongValue"
    | "AlreadyPurchased"
    | "NotPaidListing"
    | "RefundNotAvailable"
    | "AlreadyRefunded";

export function decodeTimeLockError(err: any): TimeLockErrorName | null {
    const data = err?.data ?? err?.cause?.data ?? err?.cause?.cause?.data;
    if (!data) return null;

    try {
        const decoded = decodeErrorResult({ abi: timeLockContentAbi, data });
        return decoded.errorName as TimeLockErrorName;
    } catch {
        return null;
    }
}