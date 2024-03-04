import React, { useEffect, useState } from "react";
import { TiArrowBack } from "react-icons/ti";

import styles from "./ConfirmationPage.module.scss";

interface AccommodationData {
  title: string;
}

interface ConfirmationPageProps {
  accommodation: AccommodationData | { title: string };
  selectedDates: {
    intervalStart: string;
    intervalEnd: string;
  };
  numOfPersons: number;
  totalPrice: number;
  onReturn: () => void;
}

const ConfirmationPage: React.FC<ConfirmationPageProps> = ({
  accommodation,
  selectedDates,
  numOfPersons,
  totalPrice,
  onReturn,
}) => {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    function handleScroll() {
      setScrollPosition(window.scrollY);
    }

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const accommodationTitle = accommodation.title || "Unknown Accommodation";

  return (
    <div
      className={styles.confirmationPage}
      style={{
        top: `${scrollPosition}px`,
      }}
    >
      <div className={styles.confirmation}>
        <p>
          Uspješno ste rezervirali smještaj <b>{accommodationTitle}</b>!
        </p>
        <p>
          Termin boravka: <b>{selectedDates.intervalStart}</b> -{" "}
          <b>{selectedDates.intervalEnd}</b>
        </p>
        <p>
          Broj osoba: <b>{numOfPersons}</b>
        </p>
        <p>
          Ukupna cijena: <b>{totalPrice}€</b>
        </p>
        <button onClick={onReturn}>
          <TiArrowBack />
        </button>
      </div>
    </div>
  );
};

export default ConfirmationPage;
