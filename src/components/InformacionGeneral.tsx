import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const InformacionGeneral = () => {
  const [subTab, setSubTab] = useState("resena");
  const [censo, setCenso] = useState({ ninos: 0, adolescentes: 0, adultos: 0, adultoMayor: 0, total: 0 });

  useEffect(() => {
    if (subTab === "censo") {
      fetchCenso();
    }
  }, [subTab]);

  const fetchCenso = async () => {
    const { data } = await supabase.from("residentes").select("edad");
    if (!data) return;
    let ninos = 0, adolescentes = 0, adultos = 0, adultoMayor = 0;
    data.forEach((r) => {
      if (r.edad <= 11) ninos++;
      else if (r.edad <= 17) adolescentes++;
      else if (r.edad <= 59) adultos++;
      else adultoMayor++;
    });
    setCenso({ ninos, adolescentes, adultos, adultoMayor, total: data.length });
  };

  const subTabs = [
    { id: "resena", label: "Reseña Histórica" },
    { id: "croquis", label: "Croquis" },
    { id: "estructura", label: "Estructura Organizativa" },
    { id: "censo", label: "Censo Actual" },
  ];

  return (
    <div className="animate-fade-in">
      <div className="flex flex-wrap gap-2 mb-6">
        {subTabs.map((st) => (
          <button
            key={st.id}
            onClick={() => setSubTab(st.id)}
            className={`px-3 py-2 rounded-lg text-sm font-body font-semibold transition-colors ${
              subTab === st.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-secondary"
            }`}
          >
            {st.label}
          </button>
        ))}
      </div>

      {subTab === "resena" && (
        <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
          <h2 className="text-2xl font-heading font-bold text-foreground mb-4">Reseña Histórica</h2>
          <p className="font-body text-foreground leading-relaxed">
            La Comunidad San Pablo de Carinagua fue fundada en el año <strong>1890</strong>. 
            Desde sus inicios, esta comunidad rural ha sido un ejemplo de unión, trabajo 
            y tradición. Sus habitantes han forjado a lo largo de los años una identidad 
            cultural propia, arraigada en los valores de la convivencia, el respeto a la 
            tierra y el trabajo colectivo. Hoy en día, la comunidad continúa creciendo y 
            adaptándose a los nuevos tiempos, sin perder su esencia y sus raíces históricas.
          </p>
        </div>
      )}

      {subTab === "croquis" && (
        <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
          <h2 className="text-2xl font-heading font-bold text-foreground mb-4">Croquis de la Comunidad</h2>
          <div className="bg-muted rounded-lg p-8 flex items-center justify-center min-h-[300px] border-2 border-dashed border-border">
            <div className="text-center">
              <div className="text-6xl mb-4">🗺️</div>
              <p className="font-body text-muted-foreground">
                Croquis de la Comunidad San Pablo de Carinagua
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                (Espacio reservado para el mapa/croquis de la comunidad)
              </p>
            </div>
          </div>
        </div>
      )}

      {subTab === "estructura" && (
        <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
          <h2 className="text-2xl font-heading font-bold text-foreground mb-4">Estructura Organizativa</h2>
          <div className="space-y-3 font-body">
            {[
              { cargo: "Vocero Principal", icon: "👤" },
              { cargo: "Vocero de Contraloría Social", icon: "📋" },
              { cargo: "Vocero de Salud", icon: "🏥" },
              { cargo: "Vocero de Educación", icon: "📚" },
              { cargo: "Vocero de Tierra Urbana", icon: "🏘️" },
              { cargo: "Vocero de Cultura y Deporte", icon: "⚽" },
              { cargo: "Vocero de Economía Comunal", icon: "💰" },
            ].map((item) => (
              <div key={item.cargo} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <span className="text-2xl">{item.icon}</span>
                <span className="font-semibold text-foreground">{item.cargo}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {subTab === "censo" && (
        <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
          <h2 className="text-2xl font-heading font-bold text-foreground mb-4">Censo Actual</h2>
          <div className="overflow-x-auto">
            <table className="w-full font-body border-collapse">
              <thead>
                <tr className="bg-primary text-primary-foreground">
                  <th className="px-4 py-3 text-left rounded-tl-lg">Clasificación</th>
                  <th className="px-4 py-3 text-left">Rango de Edad</th>
                  <th className="px-4 py-3 text-center rounded-tr-lg">Cantidad</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { label: "Niños", rango: "0 - 11 años", count: censo.ninos },
                  { label: "Adolescentes", rango: "12 - 17 años", count: censo.adolescentes },
                  { label: "Adultos", rango: "18 - 59 años", count: censo.adultos },
                  { label: "Adulto Mayor", rango: "60+ años", count: censo.adultoMayor },
                ].map((row, i) => (
                  <tr key={row.label} className={i % 2 === 0 ? "bg-muted/50" : "bg-card"}>
                    <td className="px-4 py-3 font-semibold text-foreground">{row.label}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.rango}</td>
                    <td className="px-4 py-3 text-center font-bold text-foreground">{row.count}</td>
                  </tr>
                ))}
                <tr className="bg-primary text-primary-foreground font-bold">
                  <td className="px-4 py-3 rounded-bl-lg" colSpan={2}>TOTAL</td>
                  <td className="px-4 py-3 text-center rounded-br-lg">{censo.total}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default InformacionGeneral;
