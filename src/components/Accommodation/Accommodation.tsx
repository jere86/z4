import React, { useState } from "react";

import styles from "./Accommodation.module.scss";

import Reservation from "../Reservation/Reservation.tsx";
import { ImInfo } from "react-icons/im";

interface AccommodationProps {
  accommodation: {
    id: number;
    title: string;
    image: string;
    capacity: number;
    beachDistanceInMeters?: number;
    amenities: {
      airConditioning: boolean;
      parkingSpace: boolean;
      pets: boolean;
      pool: boolean;
      wifi: boolean;
      tv: boolean;
    };
    pricelistInEuros: {
      intervalStart: string;
      intervalEnd: string;
      pricePerNight: number;
    }[];
  };
  numOfPersons: number;
  selectedDates: {
    intervalStart: string;
    intervalEnd: string;
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
}

const Accommodation: React.FC<AccommodationProps> = ({
  accommodation,
  numOfPersons,
  selectedDates,
  setFilters,
}) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <div className={styles.accommodation}>
      <img src={accommodation.image} alt={accommodation.title} />
      <div className={styles.info}>
        <h1>{accommodation.title}</h1>
        <p>Kapacitet: {accommodation.capacity}</p>
        {accommodation.beachDistanceInMeters && (
          <p>Udaljenost do plaže: {accommodation.beachDistanceInMeters}m</p>
        )}
        <button className={styles.button} onClick={toggleExpanded}>
          <ImInfo />
        </button>
        {expanded && (
          <div className="additional-info">
            {Object.values(accommodation.amenities).some((value) => value) ? (
              <>
                <h3>Dodatne pogodnosti:</h3>
                <ul>
                  {Object.entries(accommodation.amenities).map(
                    ([key, value]) =>
                      value && (
                        <li key={key}>
                          {key
                            .replace(/([a-z])([A-Z])/g, "$1 $2")
                            .toLocaleLowerCase()}
                        </li>
                      )
                  )}
                </ul>
              </>
            ) : (
              <h3>Nema dodatnih pogodnosti.</h3>
            )}
            <h3>Cijena prema razdoblju:</h3>
            {accommodation.pricelistInEuros.map((pricelist) => (
              <p key={pricelist.intervalStart}>
                {pricelist.intervalStart} - {pricelist.intervalEnd}:{" "}
                <b>{pricelist.pricePerNight}€</b>
              </p>
            ))}
          </div>
        )}
        <Reservation
          accommodation={accommodation}
          numOfPersons={numOfPersons}
          selectedDates={selectedDates}
          setFilters={setFilters}
          setExpanded={setExpanded}
        />
      </div>
    </div>
  );
};

export default Accommodation;
