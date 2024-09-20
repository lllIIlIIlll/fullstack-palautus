interface HeaderProps {
  courseName: string;
}

export const Header = ({ courseName }: HeaderProps) => {
  return <h1>{courseName}</h1>;
};
