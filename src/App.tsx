import React from "react";
import { useRouteError, Link, Outlet, useParams } from "react-router-dom";
import "./App.scss";
import {
  IconMoon,
  IconSunHigh,
  IconSearch,
  IconChevronDown,
  IconArrowLeft,
} from "@tabler/icons";
import axios from "axios";

const regionsList = ["Africa", "Americas", "Asia", "Europe", "Oceania"];

function App() {
  const [darkMode, setDarkMode] = React.useState(false);

  const addDarkMode = () => {
    document.body.classList.remove("light-mode");
    document.body.classList.add("dark-mode");
    setDarkMode(true);
  };

  const addLightMode = () => {
    document.body.classList.remove("dark-mode");
    document.body.classList.add("light-mode");
    setDarkMode(false);
  };

  React.useEffect(() => {
    const preferenceQuery = window.matchMedia("(prefers-color-scheme: dark)");
    if (preferenceQuery.matches) {
      addDarkMode();
    }
  }, []);

  function onClickNavButton() {
    if (darkMode) {
      addLightMode();
    } else addDarkMode();
  }

  return (
    <main>
      <nav className="nav">
        <div className="nav-container">
          <div className="nav-start">
            <h1>Where in the world?</h1>
          </div>
          <div className="nav-end">
            <button
              onClick={onClickNavButton}
              className="nav-button"
              aria-label="switch theme"
            >
              {darkMode ? <IconSunHigh /> : <IconMoon />}
            </button>
          </div>
        </div>
      </nav>
      <Outlet />
      <div className="footer">
        Challenge by{" "}
        <a
          href="https://www.frontendmentor.io?ref=challenge"
          target="_blank"
          rel="noreferrer"
        >
          Frontend Mentor
        </a>
        . Coded by <a href="https://github.com/justgo97">Hamdi</a>.
      </div>
    </main>
  );
}

function CountryCard(data: any) {
  let country = data.data;
  return (
    <div className="card-countries-item">
      <Link className="card-countries-item-header" to={`/${country.cca3}`}>
        <img
          className="card-countries-item-header-image"
          src={country.flags.png}
          alt={country.name.common}
        />
      </Link>
      <div className="card-countries-item-description">
        <h2 className="card-countries-item-description-name">
          {country.name.common}
        </h2>
        <div className="card-countries-item-description-item">
          Population:{" "}
          <span className="card-countries-item-description-item-info">
            {country.population.toLocaleString()}
          </span>
        </div>
        <div className="card-countries-item-description-item">
          Region:{" "}
          <span className="card-countries-item-description-item-info">
            {country.region}
          </span>
        </div>
        <div className="card-countries-item-description-item">
          Capital:{" "}
          <span className="card-countries-item-description-item-info">
            {country.capital}
          </span>
        </div>
      </div>
    </div>
  );
}

function Home() {
  const [searchString, setSearchString] = React.useState("");
  const [searchRegions, setSearchRegions] = React.useState<Array<string>>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [dataObj, setDataObj] = React.useState<Array<any>>([]);

  const dropdownContainerRef = React.useRef<HTMLDivElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const dropdownButtonRef = React.useRef<HTMLButtonElement>(null);

  function onChangeSearch(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchString(event.target.value);
  }

  function onClickDropdown() {
    dropdownRef.current?.classList.toggle("show");
  }

  function onClickRegion(
    event: React.MouseEvent<HTMLInputElement, MouseEvent>,
    region: string
  ) {
    if (event.currentTarget.checked) {
      setSearchRegions((state) => {
        return [...state, region];
      });
    } else {
      setSearchRegions((state) => {
        let newArr = state.filter((item) => !region.includes(item));
        return [...newArr];
      });
    }
  }

  React.useEffect(() => {
    window.onclick = function (event) {
      const withinBoundaries = event
        .composedPath()
        .includes(dropdownContainerRef.current as any);

      if (!withinBoundaries) {
        if (dropdownRef.current?.classList.contains("show")) {
          dropdownRef.current?.classList.toggle("show");
        }
      }
    };
  }, []);

  React.useEffect(() => {
    fetchData();

    async function fetchData() {
      let request = await axios.get("https://restcountries.com/v3.1/all");

      let tunisiaData = (request.data as Array<any>).find((value) => {
        return value.cca3 === "TUN";
      });

      let newArr = (request.data as Array<any>).filter(
        (value) => value.cca3 !== "TUN"
      );

      newArr.unshift(tunisiaData);

      setDataObj(newArr);
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="loading-page">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-margin-left"></div>
      <div className="card-container">
        <div className="card-inputs">
          <div className="card-search">
            <IconSearch />
            <input
              className="card-search-input"
              type="text"
              placeholder="Search for a country..."
              value={searchString}
              onChange={onChangeSearch}
            />
          </div>
          <div className="card-dropdown-container">
            <div ref={dropdownContainerRef} className="card-dropdown">
              <button
                ref={dropdownButtonRef}
                onClick={onClickDropdown}
                className="card-dropdown-button"
              >
                Filter by Region
                <IconChevronDown className="card-dropdown-button-arrow" />
              </button>
              <div ref={dropdownRef} className="card-dropdown-menu">
                {regionsList.map((value, index) => {
                  return (
                    <div key={index} className="card-dropdown-menu-item">
                      <label
                        className="card-dropdown-menu-item-label"
                        htmlFor={"label" + index}
                      >
                        {value}{" "}
                      </label>

                      <input
                        id={"label" + index}
                        className="card-dropdown-menu-item-checkbox"
                        type="checkbox"
                        onClick={(e) => onClickRegion(e, value)}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <div className="card-countries">
          {dataObj
            .filter((value: any) => {
              let sameRegion =
                !searchRegions.length || searchRegions.includes(value.region);
              return (
                value.name.common
                  .toLowerCase()
                  .startsWith(searchString.toLowerCase()) === true && sameRegion
              );
            })
            .map((value, index) => {
              return <CountryCard data={value} key={index} />;
            })}
        </div>
      </div>
      <div className="card-margin-right"></div>
    </div>
  );
}

function Country() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [isError, setIsError] = React.useState(false);
  const [countryData, setCountryData] = React.useState([]);
  const [borderCountries, setBorderCountries] = React.useState<string[]>([]);
  const [borderCodes, setBorderCodes] = React.useState<string[]>([]);
  let { countryName } = useParams();

  React.useEffect(() => {
    fetchData();

    async function fetchData() {
      try {
        setIsLoading(true);
        let request = await axios.get(
          `https://restcountries.com/v3.1/alpha/${countryName}`
        );

        setCountryData(request.data);

        let borders: string[] = [];
        let bordersCode: string[] = [];

        if (request.data[0].borders) {
          for (const cName of request.data[0].borders) {
            request = await axios.get(
              `https://restcountries.com/v3.1/alpha/${cName}`
            );

            borders.push(request.data[0].name.common);
            bordersCode.push(request.data[0].cca3);
          }

          setBorderCountries(borders);
          setBorderCodes(bordersCode);
        }
      } catch (error) {
        setIsError(true);
      }

      setIsLoading(false);
    }
  }, [countryName]);

  if (isError) {
    return <ErrorPage />;
  }

  if (isLoading) {
    return (
      <div className="loading-page">
        <p>Loading...</p>
      </div>
    );
  }

  let country = countryData[0] as any;

  function getNativeName(country: any): string {
    return country.name.nativeName[Object.keys(country.name.nativeName)[0]]
      .common;
  }

  function getCurrency(country: any): string {
    return country.currencies[Object.keys(country.currencies)[0]].name;
  }

  function getLanguages(country: any): string {
    let result = "";
    Object.keys(country.languages).forEach((key, index) => {
      result = result + country.languages[key];
      if (Object.keys(country.languages).length > index + 1) {
        result = result + ", ";
      }
    });
    return result;
  }

  return (
    <div className="details-page">
      <div className="details-page-margin-left"></div>
      <div className="details-page-container">
        <button className="details-page-back">
          <Link to={`/`}>
            <IconArrowLeft className="details-page-back-icon" /> Back
          </Link>
        </button>

        <div className="details-page-card">
          <div className="details-page-card-display">
            <img
              className="details-page-card-display-image"
              src={country.flags.png}
              alt={country.name.common}
            />
          </div>
          <div className="details-page-card-description">
            <h1>{country.name.common}</h1>
            <div className="details-page-card-description-main">
              <div className="details-page-card-description-main-part1">
                <div className="details-page-card-description-main-item">
                  Native Name:{" "}
                  <span className="details-page-card-description-main-item-info">
                    {getNativeName(country)}
                  </span>
                </div>
                <div className="details-page-card-description-main-item">
                  Population:{" "}
                  <span className="details-page-card-description-main-item-info">
                    {country.population.toLocaleString()}
                  </span>
                </div>
                <div className="details-page-card-description-main-item">
                  Region:{" "}
                  <span className="details-page-card-description-main-item-info">
                    {country.region}
                  </span>
                </div>
                <div className="details-page-card-description-main-item">
                  Sub Region:{" "}
                  <span className="details-page-card-description-main-item-info">
                    {country.subregion}
                  </span>
                </div>
                <div className="details-page-card-description-main-item">
                  Capital:{" "}
                  <span className="details-page-card-description-main-item-info">
                    {country.capital[0]}
                  </span>
                </div>
              </div>
              <div className="details-page-card-description-main-part2">
                <div className="details-page-card-description-main-item">
                  Top Level Domain:{" "}
                  <span className="details-page-card-description-main-item-info">
                    {country.tld[0]}
                  </span>
                </div>
                <div className="details-page-card-description-main-item">
                  Currencies:{" "}
                  <span className="details-page-card-description-main-item-info">
                    {getCurrency(country)}
                  </span>
                </div>
                <div className="details-page-card-description-main-item">
                  Languages:{" "}
                  <span className="details-page-card-description-main-item-info">
                    {getLanguages(country)}
                  </span>
                </div>
              </div>
            </div>
            <div className="details-page-card-description-footer">
              <span className="details-page-card-description-footer-head">
                Border Countries:
              </span>
              {borderCountries.length ? (
                borderCountries.map((value, index) => (
                  <Link key={index} to={`/${borderCodes[index]}`}>
                    <button
                      className="details-page-card-description-footer-button"
                      key={index}
                    >
                      {value}
                    </button>
                  </Link>
                ))
              ) : (
                <span>None.</span>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="details-page-margin-right"></div>
    </div>
  );
}

function ErrorPage() {
  const error = useRouteError() as any;

  return (
    <main>
      <div className="error-page">
        <h1>Oops!</h1>
        <p>Sorry, an unexpected error has occurred.</p>
        <p>
          <i>{error.statusText || error.message}</i>
        </p>
        <Link to={`/`}>
          <button className="error-page-button">Home page</button>
        </Link>
      </div>
    </main>
  );
}

export { App, Home, ErrorPage, Country };
