import React, { useEffect, useState } from "react";
import axios from "axios";

import styles from "./AccommodationPage.module.scss";

import Accommodation from "../Accommodation/Accommodation.tsx";
import Filters from "../Filters/Filters.tsx";

interface AccommodationData {
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
  availableDates: {
    intervalStart: string;
    intervalEnd: string;
  }[];
}

interface FiltersData {
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
}

const AccommodationPage: React.FC = () => {
  const [accommodation, setAccommodation] = useState<AccommodationData[]>([]);
  const [filters, setFilters] = useState<FiltersData>({
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<AccommodationData[]>(
          "https://api.adriatic.hr/test/accommodation"
        );
        setAccommodation(response.data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, []);

  console.log(accommodation);

  const filterAccommodation = (filters: FiltersData): AccommodationData[] => {
    if (
      !filters.startDate &&
      !filters.endDate &&
      filters.numOfPersons === 1 &&
      Object.values(filters.amenities).every((val) => !val)
    ) {
      return accommodation;
    }

    let filteredAccommodations = [...accommodation];

    if (filters.startDate !== "" && filters.endDate !== "") {
      filteredAccommodations = filteredAccommodations.filter(
        (accommodation) => {
          return accommodation.availableDates.some((date) => {
            return (
              filters.startDate >= date.intervalStart &&
              filters.endDate <= date.intervalEnd
            );
          });
        }
      );
    }

    if (filters.numOfPersons >= 1) {
      filteredAccommodations = filteredAccommodations.filter(
        (accommodation) => {
          return accommodation.capacity >= filters.numOfPersons;
        }
      );
    }

    filteredAccommodations = filteredAccommodations.filter((accommodation) => {
      return Object.entries(filters.amenities).every(([key, value]) => {
        return !value || (value && accommodation.amenities[key]);
      });
    });

    return filteredAccommodations;
  };

  return (
    <div className={styles.accommodationPage}>
      <Filters
        filters={filters}
        setFilters={setFilters}
        filterAccommodation={filterAccommodation}
      />
      <div className={styles.accommodations}>
        {filterAccommodation(filters).length > 0 ? (
          filterAccommodation(filters).map((accommodation) => (
            <Accommodation
              key={accommodation.id}
              accommodation={accommodation}
              numOfPersons={filters.numOfPersons}
              selectedDates={{
                intervalStart: filters.startDate,
                intervalEnd: filters.endDate,
              }}
              setFilters={setFilters}
            />
          ))
        ) : (
          <p>Nema raspoloživih smještaja</p>
        )}
      </div>
    </div>
  );
};

export default AccommodationPage;
