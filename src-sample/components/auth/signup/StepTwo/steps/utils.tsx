export const StepWrapper: React.FC<{ children: React.ReactNode; spacing?: string }> = ({
  children,
  spacing = "mt-[6vh]",
}) => <div className={spacing}>{children}</div>;


export const InfoWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex flex-col gap-6 mt-[10vh] items-center">{children}</div>
);

export const MapBoxWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex flex-col gap-6 mt-[4vh] items-center">{children}</div>
);

export const CenteredWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex flex-col gap-6 mt-[15vh] items-center">{children}</div>
);

export const DecideWhereWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex flex-col mt-[4vh] items-center">{children}</div>
);
