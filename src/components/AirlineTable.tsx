import { twJoin } from "tailwind-merge";
import {
  getAirlineTransferRate,
  getBankTransferBgColor,
  rowClasses,
} from "../helpers";
import { Airline, Alliance, Bank } from "../types";
import { banks } from "../data";
import { Oneworld, Skyteam, StarAlliance } from "../icons/alliances";

export const AirlineTable = ({
  airlineList,
  customTitle,
  airlineClickAction,
}: {
  airlineList?: Airline[];
  customTitle?: string;
  airlineClickAction?: (airline: Airline) => void;
}) => {
  return (
    <div>
      {customTitle && (
        <span className="text-lg font-semibold block my-4">{customTitle}</span>
      )}
      {airlineList?.map((airline, index) => (
        <AirlineTableRow
          airline={airline}
          index={index}
          airlineClickAction={airlineClickAction}
        />
      ))}
    </div>
  );
};

export const AirlineTableRow = ({
  airline,
  customTitle,
  index,
  airlineClickAction,
}: {
  airline: Airline;
  customTitle?: string;
  index: number;
  airlineClickAction?: (airline: Airline) => void;
}) => {
  const TitleComponent = airlineClickAction ? "button" : "span";
  const AllianceIcon = () => {
    switch (airline.alliance) {
      case Alliance.StarAlliance:
        return <StarAlliance />;
      case Alliance.Skyteam:
        return <Skyteam />;
      case Alliance.OneWorld:
        return <Oneworld />;
    }
  };
  return (
    <div className={rowClasses(index)}>
      <div className="w-4">
        <AllianceIcon />
      </div>
      <TitleComponent
        onClick={() => airlineClickAction && airlineClickAction(airline)}
        className={
          airlineClickAction && "cursor-pointer hover:underline text-left"
        }
      >
        {customTitle || `${airline.flag} ${airline.name}`}
      </TitleComponent>
      {banks.map((bank) => (
        <div className="text-center">
          <span
            className={twJoin(
              airline.transferrableFrom.find((transfer) =>
                typeof transfer === "string"
                  ? transfer === bank
                  : transfer.bank === bank
              ) && getBankTransferBgColor(bank as Bank),
              "inline-block w-16 rounded-lg text-center py-0.5"
            )}
          >
            {getAirlineTransferRate({
              airline,
              bank: bank as Bank,
            })}
          </span>
        </div>
      ))}
    </div>
  );
};
