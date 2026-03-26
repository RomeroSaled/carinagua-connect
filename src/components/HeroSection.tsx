import heroImage from "@/assets/community-hero.jpg";

const HeroSection = () => {
  return (
    <div className="relative w-full h-64 md:h-80 overflow-hidden">
      <img
        src={heroImage}
        alt="Comunidad San Pablo de Carinagua - Vista aérea de la comunidad rural"
        width={1920}
        height={800}
        className="w-full h-full object-cover"
      />
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ background: "var(--hero-overlay)" }}
      >
        <div className="text-center px-4">
          <h1 className="text-3xl md:text-5xl font-heading font-bold text-primary-foreground drop-shadow-lg">
            Comunidad San Pablo de Carinagua
          </h1>
          <p className="mt-2 text-lg md:text-xl font-body text-primary-foreground/90">
            Portal Comunitario
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
