import { twJoin } from "tailwind-merge";
import { Airline, Alliance } from "../types";
import { rowClasses } from "../helpers";
import { BankDisplayNames, banks, transferrableData } from "../data";
import { useMemo } from "react";
import { AirlineTable, AirlineTableRow } from "./AirlineTable";

export const AirlineModal = ({
  selectedAirline,
  closeModal,
}: {
  selectedAirline?: Airline;
  closeModal: () => void;
}) => {
  const selectedAirlineAlliancePartnersWithTransferPartners = useMemo(
    () =>
      selectedAirline &&
      transferrableData.filter(
        (airline) =>
          airline.alliance === selectedAirline.alliance &&
          airline !== selectedAirline &&
          airline.transferrableFrom.length !== 0
      ),
    [selectedAirline, transferrableData]
  );
  const selectedAirlineAlsoBookableThrough = useMemo(
    () =>
      selectedAirline &&
      transferrableData.filter((airline) =>
        airline.alsoBookable.some(
          (bookableAirline) => bookableAirline === selectedAirline.id
        )
      ),
    [selectedAirline, transferrableData]
  );
  const selectedAirlineAlliancePartners = useMemo(
    () =>
      selectedAirline &&
      transferrableData.filter(
        (airline) =>
          airline.alliance === selectedAirline.alliance &&
          airline !== selectedAirline &&
          airline.transferrableFrom.length === 0
      ),
    [selectedAirline, transferrableData]
  );

  const isSelectedAirlineNonAllianced =
    selectedAirline?.alliance === Alliance.NonAlliance;

  return (
    <div
      className={twJoin(
        "fixed w-full h-full top-0 left-0 flex justify-center transition-all overflow-hidden",
        selectedAirline ? "" : "pointer-events-none"
      )}
    >
      <div
        onClick={closeModal}
        className={twJoin(
          "fixed w-full h-full top-0 left-0 flex justify-center transition-all",
          selectedAirline ? "bg-black/40 opacity-1" : "opacity-0"
        )}
      />
      {selectedAirline && (
        <div className="w-4/5 bg-white dark:bg-slate-800 my-12 rounded-3xl relative p-8 overflow-scroll">
          <button
            className="absolute p-3 right-8 top-4 text-red-500 hover:text-red-700 transition-all"
            onClick={closeModal}
          >
            &#x2715;
          </button>

          <span className="text-2xl font-bold">
            {selectedAirline.flag} {selectedAirline.name}
          </span>

          <div className="grid grid-cols-6 px-2 py-3 bg-white dark:bg-slate-800">
            <span />
            {banks.map((bank) => (
              <span className="text-center font-semibold" key={bank}>
                {BankDisplayNames[bank]}
              </span>
            ))}
          </div>

          <AirlineTableRow
            airline={selectedAirline}
            customTitle="🔁 Direct transfers"
            index={0}
          />

          {isSelectedAirlineNonAllianced ? (
            <span className="block my-4">Not in an alliance</span>
          ) : (
            <AirlineTable
              airlineList={selectedAirlineAlliancePartnersWithTransferPartners}
              customTitle={`Alliance partners (${selectedAirline.alliance}):`}
            />
          )}

          {selectedAirlineAlsoBookableThrough &&
            selectedAirlineAlsoBookableThrough.length > 0 && (
              <AirlineTable
                airlineList={selectedAirlineAlsoBookableThrough}
                customTitle="Can book this airline through:"
              />
            )}

          {!isSelectedAirlineNonAllianced &&
            selectedAirlineAlliancePartners && (
              <div>
                <span className="text-lg font-semibold my-4 block">
                  Also in alliance:
                </span>
                <div className="flex flex-wrap gap-3">
                  {selectedAirlineAlliancePartners.map((airline) => (
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900">
                      {airline.flag} {airline.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>
      )}
    </div>
  );
};
