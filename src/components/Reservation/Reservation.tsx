import React, { useCallback, useEffect, useState } from "react";
import styles from "./Reservation.module.scss";
import ConfirmationPage from "../ConfirmationPage/ConfirmationPage.tsx";

interface AccommodationData {
  title: string;
  pricelistInEuros: {
    intervalStart: string;
    intervalEnd: string;
    pricePerNight: number;
  }[];
}

interface ReservationProps {
  accommodation:
    | AccommodationData
    | {
        title: string;
        pricelistInEuros: {
          intervalStart: string;
          intervalEnd: string;
          pricePerNight: number;
        }[];
      };

  selectedDates: {
    intervalStart: string;
    intervalEnd: string;
  };
  numOfPersons: number;
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
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}

const Reservation: React.FC<ReservationProps> = ({
  accommodation,
  selectedDates,
  numOfPersons,
  setFilters,
  setExpanded,
}) => {
  const [reserved, setReserved] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  const calculateTotalPrice = useCallback(() => {
    const start = new Date(selectedDates.intervalStart).getTime();
    const end = new Date(selectedDates.intervalEnd).getTime();

    let totalPrice = 0;

    accommodation.pricelistInEuros.forEach(
      ({ intervalStart, intervalEnd, pricePerNight }) => {
        const pricelistStart = new Date(intervalStart).getTime();
        const pricelistEnd = new Date(intervalEnd).getTime();

        if (start < pricelistEnd && end > pricelistStart) {
          const nightsInInterval =
            Math.ceil(
              Math.min(end, pricelistEnd) - Math.max(start, pricelistStart)
            ) /
            (1000 * 60 * 60 * 24);

          totalPrice += pricePerNight * nightsInInterval;
        }
      }
    );

    setTotalPrice(totalPrice);
  }, [
    selectedDates.intervalStart,
    selectedDates.intervalEnd,
    accommodation.pricelistInEuros,
  ]);

  useEffect(() => {
    if (
      selectedDates.intervalStart !== "" &&
      selectedDates.intervalEnd !== ""
    ) {
      calculateTotalPrice();
    }
  }, [
    selectedDates.intervalStart,
    selectedDates.intervalEnd,
    calculateTotalPrice,
  ]);

  const handleReservation = () => {
    calculateTotalPrice();
    setReserved(true);
  };

  const handleReturn = () => {
    setReserved(false);
    setTotalPrice(0);
    setFilters({
      startDate: "",
      endDate: "",
      numOfPersons: 1,
      amenities: {
        airConditioning: false,
        parkingSpace: false,
        pets: false,
        pool: false,
        wifi: false,
        tv: false,
      },
    });
    setExpanded(false);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className={styles.reservation}>
      {reserved ? (
        <ConfirmationPage
          accommodation={accommodation}
          selectedDates={selectedDates}
          numOfPersons={numOfPersons}
          totalPrice={totalPrice}
          onReturn={handleReturn}
        />
      ) : (
        <div className={styles.priceRange}>
          {selectedDates.intervalStart !== "" &&
          selectedDates.intervalEnd !== "" ? (
            <>
              <p>
                Ukupna cijena boravka: <b>{totalPrice}€</b>
              </p>
              <button
                className={styles.reservationBtn}
                onClick={handleReservation}
              >
                REZERVIRAJ
              </button>
            </>
          ) : accommodation.pricelistInEuros.length === 1 ? (
            <>
              <p>
                Cijena ovog smještaja je{" "}
                <b>{accommodation.pricelistInEuros[0].pricePerNight}€</b>
              </p>
            </>
          ) : (
            <>
              <p>
                Raspon cijena ovog smještaja:{" "}
                <b>
                  {Math.min(
                    ...accommodation.pricelistInEuros.map(
                      (item) => item.pricePerNight
                    )
                  )}
                  €
                </b>{" "}
                -{" "}
                <b>
                  {Math.max(
                    ...accommodation.pricelistInEuros.map(
                      (item) => item.pricePerNight
                    )
                  )}
                  €
                </b>
              </p>
              <p className={styles.pickADate}>
                *Odaberite datume boravka da biste vidjeli točnu cijenu i
                rezervirali smještaj.
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Reservation;
