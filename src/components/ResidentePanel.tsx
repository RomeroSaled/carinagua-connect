import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { generateConstanciaResidencia } from "@/lib/pdfGenerator";
import type { Tables } from "@/integrations/supabase/types";
import BackButton from "./BackButton";

interface ResidentePanelProps {
  onBack: () => void;
}

const ResidentePanel = ({ onBack }: ResidentePanelProps) => {
  const [cedula, setCedula] = useState("");
  const [residente, setResidente] = useState<Tables<"residentes"> | null>(null);
  const [error, setError] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = async () => {
    setError("");
    if (!cedula.trim()) {
      setError("Ingrese su número de cédula");
      return;
    }

    // Check if exists in residentes (must also be in representantes data)
    const { data } = await supabase
      .from("residentes")
      .select("*")
      .eq("cedula", cedula.trim())
      .maybeSingle();

    if (!data) {
      setError("No es residente");
      setResidente(null);
      setLoggedIn(false);
      return;
    }

    setResidente(data);
    setLoggedIn(true);
  };

  const isMayorDeEdad = residente && residente.edad >= 18;

  if (loggedIn && residente) {
    return (
      <div className="animate-fade-in">
        <BackButton onClick={() => { setLoggedIn(false); setResidente(null); setCedula(""); onBack(); }} />
        <div className="bg-card rounded-lg p-6 shadow-sm border border-border max-w-lg mx-auto">
          <h2 className="text-2xl font-heading font-bold text-foreground mb-6 text-center">
            Información Personal
          </h2>
          <div className="space-y-3 font-body">
            {[
              { label: "Nombre", value: `${residente.nombre} ${residente.apellido}` },
              { label: "Cédula", value: residente.cedula },
              { label: "Edad", value: `${residente.edad} años` },
              { label: "Sexo", value: residente.sexo },
              { label: "Discapacidad", value: residente.discapacidad ? "Sí" : "No" },
              { label: "Situación Económica", value: residente.situacion_economica },
              { label: "Hijos", value: String(residente.hijos) },
            ].map((item) => (
              <div key={item.label} className="flex justify-between p-3 bg-muted rounded-lg">
                <span className="font-semibold text-foreground">{item.label}:</span>
                <span className="text-muted-foreground">{item.value}</span>
              </div>
            ))}
          </div>

          {isMayorDeEdad && (
            <button
              onClick={() => generateConstanciaResidencia(residente)}
              className="back-button w-full mt-6 text-center"
            >
              📄 Descargar Constancia de Residencia
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="bg-card rounded-lg p-8 shadow-sm border border-border max-w-md mx-auto">
        <h2 className="text-2xl font-heading font-bold text-foreground mb-6 text-center">
          Acceso de Residente
        </h2>
        <div className="space-y-4 font-body">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1">Número de Cédula</label>
            <input
              type="text"
              value={cedula}
              onChange={(e) => setCedula(e.target.value)}
              placeholder="Ej: 12345678"
              className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
          </div>
          {error && (
            <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg font-semibold text-center">
              {error}
            </div>
          )}
          <button onClick={handleLogin} className="back-button w-full text-center">
            Ingresar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResidentePanel;
