import Image from "next/image";

type ServiceCardProps = {
  title: string;
  description: string;
  image?: string;
};

export default function ServiceCard({
  title,
  description,
  image,
}: ServiceCardProps) {
  return (
    <article className="group">
      <div className="h-64 w-full rounded-2xl bg-linear-to-br from-[#f0efe9] to-[#e6e4dc] overflow-hidden grayscale-50 group-hover:grayscale-0 transition duration-500 relative">
        {image && (
          <Image src={image} alt={title} fill className="object-cover  " />
        )}
        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition"></div>
      </div>
      <h3 className="mt-6 text-xl font-serif font-medium text-foreground">
        {title}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground opacity-80 max-w-xs">
        {description}
      </p>
    </article>
  );
}
