interface CardProps {
  name: string;
  position: number;
}
export default function Card({ name, position }: CardProps) {
  return (
    <div className="flex items-center">
      <p className="text-gray-900 text-lg title-font font-medium">{name}</p>
    </div>
  );
}
