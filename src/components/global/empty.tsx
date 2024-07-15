import Image from "next/image";

interface EmptyProps {
  label: string;
  src: string;
}

export const Empty = ({ label, src }: EmptyProps) => {
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <div className="relative h-72 w-72">
        <Image
          priority
          src={src}
          fill
          alt="Empty"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <p className="text-muted-foreground text-md text-center mt-4">{label}</p>
    </div>
  );
};
