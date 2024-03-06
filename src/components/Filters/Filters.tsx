import React, { forwardRef, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";

import styles from "./Filters.module.scss";

interface FiltersProps {
  filters: {
    startDate: string;
    endDate: string;
    numOfPersons: number;
    amenities: {
      airConditioning: boolean;
      parkingSpace: boolean;
      pets: boolean;
      pool: boolean;
      wifi: boolean;
      tv: boolean;
    };
  };
  setFilters: React.Dispatch<
    React.SetStateAction<{
      startDate: string;
      endDate: string;
      numOfPersons: number;
      amenities: {
        airConditioning: boolean;
        parkingSpace: boolean;
        pets: boolean;
        pool: boolean;
        wifi: boolean;
        tv: boolean;
      };
    }>
  >;
  filterAccommodation: (filters: FiltersProps["filters"]) => void;
}

const Filters: React.FC<FiltersProps> = ({
  filters,
  setFilters,
  filterAccommodation,
}) => {
  const handleStartDateChange = (date: Date) => {
    const formattedDate = date.toISOString().split("T")[0];
    setFilters({ ...filters, startDate: formattedDate });
  };

  const handleEndDateChange = (date: Date) => {
    const formattedDate = date.toISOString().split("T")[0];
    setFilters({ ...filters, endDate: formattedDate });
  };

  const handleNumOfPersonsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, numOfPersons: parseInt(e.target.value) });
  };

  const handleAmenityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amenity = e.target.name;
    setFilters({
      ...filters,
      amenities: {
        ...filters.amenities,
        [amenity]: e.target.checked,
      },
    });
  };

  useEffect(() => {
    filterAccommodation(filters);
  }, [filters, filterAccommodation]);

  const CalendarInput = forwardRef<
    HTMLButtonElement,
    {
      value?: string;
      onClick?: React.MouseEventHandler<HTMLButtonElement>;
      date: boolean;
    }
  >(({ value, onClick, date }, ref) => (
    <button ref={ref} onClick={onClick}>
      <FaCalendarAlt />
      {date ? (
        <p>{value ? value : "DOLAZAK"}</p>
      ) : (
        <p>{value ? value : "ODLAZAK"}</p>
      )}
    </button>
  ));

  return (
    <div className={styles.filters}>
      <div className={styles.dateInput}>
        <label className={styles.dateLabel}>
          Datum dolaska:
          <DatePicker
            selected={filters.startDate ? new Date(filters.startDate) : null}
            onChange={handleStartDateChange}
            minDate={new Date()}
            maxDate={
              filters.endDate
                ? new Date(new Date(filters.endDate).getTime() - 86400000)
                : new Date("2024-12-31")
            }
            dateFormat="yyyy-MM-dd"
            shouldCloseOnSelect={true}
            customInput={<CalendarInput date={true} />}
          />
        </label>
        <label className={styles.dateLabel}>
          Datum odlaska:
          <DatePicker
            selected={filters.endDate ? new Date(filters.endDate) : null}
            onChange={handleEndDateChange}
            minDate={
              filters.startDate
                ? new Date(new Date(filters.startDate).getTime() + 86400000)
                : new Date(new Date().getTime() + 86400000)
            }
            maxDate={new Date("2024-12-31")}
            dateFormat="yyyy-MM-dd"
            shouldCloseOnSelect={true}
            customInput={<CalendarInput date={false} />}
          />
        </label>
      </div>
      <label htmlFor="numOfPersons" className={styles.numOfPersonsInput}>
        Broj osoba:
        <input
          id="numOfPersons"
          type="number"
          value={filters.numOfPersons}
          onChange={handleNumOfPersonsChange}
          min={1}
          max={10}
        />
      </label>

      <div className={styles.amenities}>
        {Object.entries(filters.amenities).map(([key, value]) => (
          <label key={key}>
            <input
              type="checkbox"
              name={key}
              checked={value}
              onChange={handleAmenityChange}
            />
            {key.replace(/([a-z])([A-Z])/g, "$1 $2").toLocaleLowerCase()}
          </label>
        ))}
      </div>
    </div>
  );
};

export default Filters;
