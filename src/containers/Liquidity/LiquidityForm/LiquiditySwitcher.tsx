import React from "react";
import { useTranslation } from "next-i18next";
import { FoundDex } from "@quipuswap/sdk";

import { Tooltip } from "@components/ui/Tooltip";
import { Button } from "@components/ui/Button";

import { Field } from "react-final-form";
import { Switcher } from "@components/ui/Switcher";
import s from "../Liquidity.module.sass";

interface LiquiditySwitcherProps {
  currentTab: any;
  handleAddLiquidity: () => void;
  dex?: FoundDex;
}

export const LiquiditySwitcher: React.FC<LiquiditySwitcherProps> = ({
  currentTab,
  handleAddLiquidity,
  dex,
}) => {
  const { t } = useTranslation(["liquidity"]);

  if (currentTab.id !== "add") {
    return null;
  }
  return (
    <>
      <Field name="rebalanceSwitcher">
        {({ input }) => (
          <div className={s.switcher}>
            <Switcher
              {...input}
              isActive={input.value}
              className={s.switcherInput}
              disabled={!dex}
            />
            <span className={s.rebalance}>
              {t("liquidity|Rebalance Liquidity")}
            </span>
            <Tooltip
              content={t(
                "liquidity|Automatically adjust your token balance to a 50%-50% ratio. If you don't have enough token 1, this feature will convert token 2 to token 1 to receive an equal proportion."
              )}
            />
          </div>
        )}
      </Field>
      <Button onClick={handleAddLiquidity} className={s.button}>
        {currentTab.label}
      </Button>
    </>
  );
};
