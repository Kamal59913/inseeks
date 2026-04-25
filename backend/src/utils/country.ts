import fs from "fs";
import { Request, Response } from "express";

interface Country {
  countryName: string;
  states: { stateName: string; cities: string[] }[];
}

const getCountryData = (): Country[] => {
  const data = fs.readFileSync("./src/utils/country.json", "utf-8");
  return JSON.parse(data);
};

export const getStatesByCountry = (req: Request, res: Response) => {
  const { countryName } = req.params;
  const countryData = getCountryData();
  const country = countryData.find((c) => c.countryName === countryName);

  if (country) {
    res.status(200).json({
      states: country.states.map((state) => state.stateName),
    });
  } else {
    res.status(404).json({ message: "Country not found" });
  }
};

export const getCitiesByState = (req: Request, res: Response) => {
  const { stateName } = req.params;
  const countryData = getCountryData();
  let stateFound = false;
  let cities: string[] = [];

  countryData.forEach((country) => {
    const state = country.states.find((s) => s.stateName === stateName);
    if (state) {
      stateFound = true;
      cities = state.cities;
    }
  });

  if (stateFound) {
    res.status(200).json({ cities });
  } else {
    res.status(404).json({ message: "State not found" });
  }
};