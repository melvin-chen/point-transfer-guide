import { useMemo, useState } from "react";
import { transferrableData } from "./data";
import "./styles.css";
import { Airline, Alliance, Bank } from "./types";
import { twJoin } from "tailwind-merge";
import { getAirlineTransferRate, getBankTransferBgColor } from "./helpers";

const banks = Object.keys(Bank) as (keyof typeof Bank)[];

const BankDisplayNames = {
  [Bank.Chase]: "Chase",
  [Bank.AmericanExpress]: "American Express",
  [Bank.Citi]: "Citi",
  [Bank.CapitalOne]: "Capital One",
  [Bank.Bilt]: "Bilt",
};

const rowClasses = (index: number) =>
  twJoin(
    "grid grid-cols-6 px-2 py-3",
    index % 2 === 0
      ? "bg-slate-100 dark:bg-slate-800"
      : "bg-white dark:bg-slate-900"
  );

export default function App() {
  const [selectedAirline, setSelectedAirline] = useState<Airline>();
  const [selectedBanks, setSelectedBanks] = useState<Bank[]>([]);

  const [airlineInput, setAirlineInput] = useState("");
  const [isBankFilterAnd, setIsBankFilterAnd] = useState(true);

  const usedData = useMemo(() => {
    return (
      selectedBanks.length > 0
        ? transferrableData.filter((airline) =>
            isBankFilterAnd
              ? selectedBanks.every((bank) =>
                  airline.transferrableFrom.some((transfer) =>
                    typeof transfer === "string"
                      ? transfer === bank
                      : transfer.bank === bank
                  )
                )
              : airline.transferrableFrom.some((bank) =>
                  typeof bank === "string"
                    ? selectedBanks.includes(bank)
                    : selectedBanks.includes(bank.bank)
                )
          )
        : transferrableData
    ).filter((airline) => airline.transferrableFrom.length !== 0);
  }, [selectedBanks, transferrableData, isBankFilterAnd]);

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

  return (
    <div
      className={twJoin(
        "p-4 lg:px-20 lg:py-8 dark:bg-slate-900 dark:text-white",
        selectedAirline && "overflow-hidden"
      )}
    >
      <h1 className="text-3xl mb-4 font-bold">Point Transfer Guide</h1>
      <div className="relative w-full">
        <input
          className="w-full border rounded-lg p-3 peer dark:bg-slate-900"
          id="airline"
          type="text"
          value={airlineInput}
          onChange={(e) => setAirlineInput(e.target.value)}
        />
        <label
          className={twJoin(
            "absolute flex items-center left-1.5 px-1.5 transition-all dark:bg-slate-900 cursor-text",
            airlineInput
              ? "w-auto h-auto -top-3 text-sm bg-white dark:bg-slate-900"
              : "top-3.5 peer-focus:-top-3 peer-focus:bg-white  dark:peer-focus:bg-slate-900"
          )}
          htmlFor="airline"
        >
          Search Airline
        </label>

        {airlineInput && (
          <div className="z-10 absolute w-full p-3 mt-2 rounded-lg bg-white dark:bg-slate-700 shadow-lg flex gap-4">
            {transferrableData
              .filter((airline) =>
                airline.name.toLowerCase().includes(airlineInput.toLowerCase())
              )
              .slice(0, 5)
              .map((airline) => (
                <button
                  className="border-2 border-blue-200 p-2 rounded-lg hover:border-blue-500 hover:bg-blue-100 transition-all"
                  key={airline.id}
                  onClick={() => {
                    setSelectedAirline(airline);
                    setAirlineInput("");
                  }}
                >
                  {airline.name}
                </button>
              ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-[auto_1fr_auto] gap-4 py-4">
        <div>
          <input
            type="checkbox"
            id="isBankFilterAnd"
            readOnly
            className="hidden"
            checked={isBankFilterAnd}
            onClick={() => setIsBankFilterAnd(!isBankFilterAnd)}
          />
          <label htmlFor="isBankFilterAnd" className="flex items-stretch group">
            <span
              className={twJoin(
                "block rounded-l-lg border-2 border-r-0 border-blue-200 dark:border-slate-600 py-2 px-3 transition-all",
                isBankFilterAnd
                  ? "group-hover:bg-blue-100  dark:group-hover:border-slate-700 dark:group-hover:bg-slate-100/10"
                  : "bg-blue-500 text-white border-blue-500 dark:border-slate-500 dark:bg-slate-500"
              )}
            >
              OR
            </span>
            <span
              className={twJoin(
                "block rounded-r-lg border-2 border-l-0 border-blue-200 dark:border-slate-600 py-2 px-3 transition-all",
                isBankFilterAnd
                  ? "bg-blue-500 text-white border-blue-500 dark:border-slate-500 dark:bg-slate-500"
                  : "group-hover:bg-blue-100 dark:group-hover:border-slate-700 dark:group-hover:bg-slate-100/10"
              )}
            >
              AND
            </span>
          </label>
        </div>

        <div className="flex gap-2">
          {banks.map((bankName) => (
            <div key={bankName}>
              <input
                type="checkbox"
                id={bankName}
                readOnly
                checked={selectedBanks.includes(bankName as Bank)}
                className="hidden peer"
                onClick={() => {
                  selectedBanks.includes(bankName as Bank)
                    ? setSelectedBanks(
                        selectedBanks.filter((bank) => bank !== bankName)
                      )
                    : setSelectedBanks([...selectedBanks, bankName as Bank]);
                }}
              />
              <label
                htmlFor={bankName}
                className="block p-2 rounded-lg border-2 border-blue-200 hover:border-blue-500 hover:bg-blue-100 peer-checked:border-blue-500 peer-checked:bg-blue-500 peer-checked:text-white transition-all dark:border-slate-600 dark:hover:border-slate-700 dark:hover:bg-slate-100/10 dark:peer-checked:border-slate-500 dark:peer-checked:bg-slate-500"
              >
                {BankDisplayNames[bankName]}
              </label>
            </div>
          ))}
        </div>

        <button
          onClick={() => {
            setSelectedBanks([]);
          }}
        >
          Clear Filters
        </button>
      </div>

      <table className="w-full">
        <thead className="sticky top-0">
          <tr className="grid grid-cols-6 py-2 bg-white dark:bg-slate-900 border-b-2 dark:border-b-slate-700">
            <th className="text-left">Airline</th>
            <th>Chase</th>
            <th>American Express</th>
            <th>Citi</th>
            <th>Capital One</th>
            <th>Bilt</th>
          </tr>
        </thead>
        <tbody>
          {usedData.map((airline, index) => (
            <tr key={airline.id} className={twJoin(rowClasses(index), "")}>
              <th
                className="text-left hover:cursor-pointer font-normal"
                onClick={() => setSelectedAirline(airline)}
              >
                {airline.flag} {airline.name}
              </th>

              {banks.map((bank) => (
                <td className="text-center" key={airline.id + bank}>
                  <span
                    className={twJoin(
                      airline.transferrableFrom.find((transfer) =>
                        typeof transfer === "string"
                          ? transfer === bank
                          : transfer.bank === bank
                      ) && getBankTransferBgColor(bank as Bank),
                      "inline-block w-16 rounded py-0.5"
                    )}
                  >
                    {getAirlineTransferRate({ airline, bank: bank as Bank })}
                  </span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div
        className={twJoin(
          "fixed w-full h-full top-0 left-0 flex justify-center transition-all overflow-hidden",
          selectedAirline ? "" : "pointer-events-none"
        )}
      >
        <div
          onClick={() => setSelectedAirline(undefined)}
          className={twJoin(
            "fixed w-full h-full top-0 left-0 flex justify-center transition-all",
            selectedAirline ? "bg-black/40 opacity-1" : "opacity-0"
          )}
        />
        {selectedAirline && (
          <div className="w-4/5 bg-white dark:bg-slate-800 my-12 rounded-3xl relative p-8 overflow-scroll">
            <button
              className="absolute p-3 right-8 top-4 text-red-500 hover:text-red-700 transition-all"
              onClick={() => setSelectedAirline(undefined)}
            >
              &#x2715;
            </button>

            <span className="text-2xl font-bold">
              {selectedAirline.flag} {selectedAirline.name}
            </span>

            <div className={rowClasses(1)}>
              <span />
              {banks.map((bank) => (
                <span className="text-center font-semibold" key={bank}>
                  {BankDisplayNames[bank]}
                </span>
              ))}
            </div>

            <div className={rowClasses(0)}>
              <span>🔁 Direct transfers</span>
              {banks.map((bank) => (
                <div className="text-center">
                  <span
                    className={twJoin(
                      selectedAirline.transferrableFrom.find((transfer) =>
                        typeof transfer === "string"
                          ? transfer === bank
                          : transfer.bank === bank
                      ) && getBankTransferBgColor(bank as Bank),
                      "inline-block w-16 rounded text-center py-0.5"
                    )}
                  >
                    {getAirlineTransferRate({
                      airline: selectedAirline,
                      bank: bank as Bank,
                    })}
                  </span>
                </div>
              ))}
            </div>

            <div>
              {selectedAirline.alliance === Alliance.NonAlliance ? (
                <span className="block my-4">Not in an alliance</span>
              ) : (
                <>
                  <span className="text-lg font-semibold block my-4">
                    Alliance partners ({selectedAirline.alliance}):
                  </span>
                  {selectedAirlineAlliancePartnersWithTransferPartners?.map(
                    (airline, index) => (
                      <div className={rowClasses(index)}>
                        <span>
                          {airline.flag} {airline.name}
                        </span>
                        {banks.map((bank) => (
                          <div className="text-center">
                            <span
                              className={twJoin(
                                airline.transferrableFrom.find((transfer) =>
                                  typeof transfer === "string"
                                    ? transfer === bank
                                    : transfer.bank === bank
                                ) && getBankTransferBgColor(bank as Bank),
                                "inline-block w-16 rounded text-center py-0.5"
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
                    )
                  )}
                </>
              )}
            </div>

            {selectedAirlineAlsoBookableThrough &&
              selectedAirlineAlsoBookableThrough.length > 0 && (
                <div>
                  <span className="text-lg font-semibold block my-4">
                    Can book this airline through:
                  </span>
                  {selectedAirlineAlsoBookableThrough.map((airline, index) => (
                    <div className={rowClasses(index)}>
                      <span>
                        {airline.flag} {airline.name}
                      </span>
                      {banks.map((bank) => (
                        <div className="text-center">
                          <span
                            className={twJoin(
                              airline.transferrableFrom.find((transfer) =>
                                typeof transfer === "string"
                                  ? transfer === bank
                                  : transfer.bank === bank
                              ) && getBankTransferBgColor(bank as Bank),
                              "inline-block w-16 rounded text-center py-0.5"
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
                  ))}
                </div>
              )}

            {selectedAirline.alliance !== Alliance.NonAlliance &&
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
    </div>
  );
}
