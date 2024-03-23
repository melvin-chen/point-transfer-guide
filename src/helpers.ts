import { twJoin } from "tailwind-merge";
import { Airline, Bank } from "./types";

export const getAirlineTransferRate = ({
  airline,
  bank,
}: {
  airline: Airline;
  bank: Bank;
}) => {
  const transferPartnerRate = airline.transferrableFrom.find((transfer) =>
    typeof transfer === "string" ? transfer === bank : transfer.bank === bank
  );

  const transferShapeObject =
    typeof transferPartnerRate !== "undefined" &&
    (typeof transferPartnerRate === "string"
      ? { bank, rate: "1:1" }
      : transferPartnerRate);

  return transferShapeObject ? transferShapeObject.rate : "--";
};

export const getBankTransferBgColor = (bank: Bank) => {
  switch (bank) {
    case Bank.Chase:
      return "bg-indigo-200 dark:bg-indigo-800";
    case Bank.AmericanExpress:
      return "bg-amber-100 dark:bg-amber-800";
    case Bank.Citi:
      return "bg-pink-200 dark:bg-pink-800";
    case Bank.CapitalOne:
      return "bg-violet-200 dark:bg-violet-800";
    case Bank.Bilt:
      return "bg-zinc-200 dark:bg-zinc-500";
    case Bank.WellsFargo:
      return "bg-red-100 dark:bg-red-500";
  }
};

export const rowClasses = (index: number) =>
  twJoin(
    "grid grid-cols-[auto_repeat(7,_1fr)] gap-2 items-center px-2 py-3",
    index % 2 === 0
      ? "bg-slate-100 dark:bg-slate-800"
      : "bg-white dark:bg-slate-900"
  );
