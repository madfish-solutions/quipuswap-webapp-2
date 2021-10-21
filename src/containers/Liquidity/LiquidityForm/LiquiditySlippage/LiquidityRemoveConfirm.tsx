import { useTranslation } from "next-i18next";
import React from "react";
import BigNumber from "bignumber.js";

import { parseTezDecimals, slippageToBignum } from "@utils/helpers";
import { CurrencyAmount } from "@components/common/CurrencyAmount";
import { Button } from "@components/ui/Button";

import { LiquidityFormValues } from "@utils/types";
import s from "../../Liquidity.module.sass";

interface LiquidityRemoveConfirmProps {
  handleRemoveLiquidity: () => void;
  values: LiquidityFormValues;
  tab: "remove" | "add";
  tokenAName: string;
  tokenBName: string;
}

export const LiquidityRemoveConfirm: React.FC<LiquidityRemoveConfirmProps> = ({
  handleRemoveLiquidity,
  values,
  tab,
  tokenAName,
  tokenBName,
}) => {
  const { t } = useTranslation(["liquidity"]);
  if (tab !== "remove") {
    return null;
  }
  const slipPercA = slippageToBignum(values.slippage).times(
    new BigNumber(values.balanceA ?? 0)
  );
  const slipPercB = slippageToBignum(values.slippage).times(
    new BigNumber(values.balanceB ?? 0)
  );
  const minimumReceivedA = parseTezDecimals(
    new BigNumber(values.balanceA ?? 0).minus(slipPercA).toString() ?? "0"
  );
  const minimumReceivedB = parseTezDecimals(
    new BigNumber(values.balanceB ?? 0).minus(slipPercB).toString() ?? "0"
  );
  return (
    <>
      <div className={s.receive}>
        <span className={s.receiveLabel}>
          {t("liquidity|Minimum received")}:
        </span>
        <CurrencyAmount currency={tokenAName} amount={minimumReceivedA} />
      </div>
      <div className={s.receive}>
        <span className={s.receiveLabel}>
          {t("liquidity|Minimum received")}:
        </span>
        <CurrencyAmount currency={tokenBName} amount={minimumReceivedB} />
      </div>
      <Button onClick={handleRemoveLiquidity} className={s.button}>
        {t("liquidity|Remove & Unvote")}
      </Button>
    </>
  );
};
