import { useMemo, useState } from "react";
import { BankDisplayNames, banks, transferrableData } from "./data";
import "./styles.css";
import { Airline, Bank } from "./types";
import { twJoin } from "tailwind-merge";
import { AirlineModal } from "./components/AirlineModal";
import { AirlineTable } from "./components/AirlineTable";

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

      <div>
        <div className="grid grid-cols-6 py-2 bg-white dark:bg-slate-900 border-b-2 dark:border-b-slate-700">
          <span className="text-left font-semibold">Airline</span>
          {Object.keys(BankDisplayNames).map((bank) => (
            <span className="text-center font-semibold">
              {BankDisplayNames[bank as keyof typeof BankDisplayNames]}
            </span>
          ))}
        </div>

        <AirlineTable
          airlineList={usedData}
          airlineClickAction={(airline: Airline) => setSelectedAirline(airline)}
        />
      </div>

      <AirlineModal
        selectedAirline={selectedAirline}
        closeModal={() => setSelectedAirline(undefined)}
      />
    </div>
  );
}
