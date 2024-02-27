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
      return "bg-blue-200";
    case Bank.AmericanExpress:
      return "bg-amber-100";
    case Bank.Citi:
      return "bg-red-200";
    case Bank.CapitalOne:
      return "bg-purple-200";
    case Bank.Bilt:
      return "bg-zinc-200";
  }
};
