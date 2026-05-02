export enum GradeEnum {
  // Nursery = "Nursery",
  // LKG = "LKG",
  // UKG = "UKG",
  One = "1",
  Two = "2",
  Three = "3",
  Four = "4",
  Five = "5",
  Six = "6",
  Seven = "7",
  Eight = "8",
  Nine = "9",
  Ten = "10",
  Eleven = "11",
  Twelve = "12",
}

export const gradeValues = Object.values(GradeEnum);

export type GradeValue = (typeof gradeValues)[number];

export const gradeOptions: { value: GradeValue; label: string }[] = gradeValues.map(
  (grade) => ({
    value: grade,
    label: grade,
  })
);
