export const StepWrapper: React.FC<{ children: React.ReactNode; spacing?: string }> = ({
  children,
  spacing = "mt-[6vh]",
}) => <div className={spacing}>{children}</div>;


export const InfoWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex flex-col gap-6 mt-[10vh] items-center">{children}</div>
);

export const CheckInboxWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex flex-col gap-3 mt-[14vh] items-center">{children}</div>
);
