import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import BackButton from "./BackButton";

interface RepresentantePanelProps {
  onBack: () => void;
}

type View = "login" | "firstRegister" | "dashboard" | "addRepresentante" | "addResidente" | "dataResidentes" | "dataRepresentantes";

const RepresentantePanel = ({ onBack }: RepresentantePanelProps) => {
  const [view, setView] = useState<View>("login");
  const [hasRepresentantes, setHasRepresentantes] = useState(false);
  const [currentRepresentante, setCurrentRepresentante] = useState<Tables<"representantes"> | null>(null);
  const [cedula, setCedula] = useState("");
  const [error, setError] = useState("");
  const [residentes, setResidentes] = useState<Tables<"residentes">[]>([]);
  const [representantes, setRepresentantes] = useState<Tables<"representantes">[]>([]);

  // Form states
  const [formCedula, setFormCedula] = useState("");
  const [formNombre, setFormNombre] = useState("");
  const [formApellido, setFormApellido] = useState("");
  const [formCargo, setFormCargo] = useState("");
  // Residente form
  const [rCedula, setRCedula] = useState("");
  const [rNombre, setRNombre] = useState("");
  const [rApellido, setRApellido] = useState("");
  const [rEdad, setREdad] = useState("");
  const [rSexo, setRSexo] = useState("Masculino");
  const [rDiscapacidad, setRDiscapacidad] = useState(false);
  const [rSituacion, setRSituacion] = useState("Leve");
  const [rHijos, setRHijos] = useState("0");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    checkRepresentantes();
  }, []);

  const checkRepresentantes = async () => {
    const { data, error: err } = await supabase.from("representantes").select("id").limit(1);
    if (data && data.length > 0) {
      setHasRepresentantes(true);
      setView("login");
    } else {
      setHasRepresentantes(false);
      setView("firstRegister");
    }
  };

  const handleLogin = async () => {
    setError("");
    if (!cedula.trim()) { setError("Ingrese su cédula"); return; }
    const { data } = await supabase.from("representantes").select("*").eq("cedula", cedula.trim()).maybeSingle();
    if (!data) { setError("No es representante"); return; }
    setCurrentRepresentante(data);
    setView("dashboard");
  };

  const handleFirstRegister = async () => {
    setError("");
    if (!formCedula || !formNombre || !formApellido || !formCargo) {
      setError("Todos los campos son obligatorios");
      return;
    }
    const { error: err } = await supabase.from("representantes").insert({
      cedula: formCedula, nombre: formNombre, apellido: formApellido, cargo: formCargo,
    });
    if (err) { setError(err.message); return; }
    const { data } = await supabase.from("representantes").select("*").eq("cedula", formCedula).single();
    setCurrentRepresentante(data);
    setHasRepresentantes(true);
    clearForm();
    setView("dashboard");
  };

  const handleAddRepresentante = async () => {
    setError(""); setSuccessMsg("");
    if (!formCedula || !formNombre || !formApellido || !formCargo) {
      setError("Todos los campos son obligatorios"); return;
    }
    const { error: err } = await supabase.from("representantes").insert({
      cedula: formCedula, nombre: formNombre, apellido: formApellido, cargo: formCargo,
    });
    if (err) { setError(err.message); return; }
    setSuccessMsg("Representante agregado exitosamente");
    clearForm();
  };

  const handleAddResidente = async () => {
    setError(""); setSuccessMsg("");
    if (!rCedula || !rNombre || !rApellido || !rEdad) {
      setError("Todos los campos son obligatorios"); return;
    }
    const { error: err } = await supabase.from("residentes").insert({
      cedula: rCedula, nombre: rNombre, apellido: rApellido, edad: parseInt(rEdad),
      sexo: rSexo, discapacidad: rDiscapacidad, situacion_economica: rSituacion,
      hijos: parseInt(rHijos), agregado_por: currentRepresentante?.id,
    });
    if (err) { setError(err.message); return; }
    setSuccessMsg("Residente agregado exitosamente");
    clearResidenteForm();
  };

  const loadResidentes = async () => {
    const { data } = await supabase.from("residentes").select("*").order("nombre");
    if (data) setResidentes(data);
    setView("dataResidentes");
  };

  const loadRepresentantes = async () => {
    const { data } = await supabase.from("representantes").select("*").order("nombre");
    if (data) setRepresentantes(data);
    setView("dataRepresentantes");
  };

  const deleteResidente = async (id: string) => {
    await supabase.from("residentes").delete().eq("id", id);
    loadResidentes();
  };

  const deleteRepresentante = async (id: string) => {
    if (id === currentRepresentante?.id) {
      setError("No puede eliminarse a sí mismo"); return;
    }
    await supabase.from("representantes").delete().eq("id", id);
    loadRepresentantes();
  };

  const clearForm = () => { setFormCedula(""); setFormNombre(""); setFormApellido(""); setFormCargo(""); };
  const clearResidenteForm = () => { setRCedula(""); setRNombre(""); setRApellido(""); setREdad(""); setRSexo("Masculino"); setRDiscapacidad(false); setRSituacion("Leve"); setRHijos("0"); };

  const inputClass = "w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring font-body";
  const labelClass = "block text-sm font-semibold text-foreground mb-1 font-body";

  // First register form
  if (view === "firstRegister") {
    return (
      <div className="animate-fade-in max-w-md mx-auto">
        <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
          <h2 className="text-xl font-heading font-bold text-foreground mb-4 text-center">Agregar Representante</h2>
          <p className="text-sm text-muted-foreground mb-4 text-center font-body">No hay representantes registrados. Registre al primer representante.</p>
          <div className="space-y-3">
            <div><label className={labelClass}>Cédula</label><input className={inputClass} value={formCedula} onChange={(e) => setFormCedula(e.target.value)} /></div>
            <div><label className={labelClass}>Nombre</label><input className={inputClass} value={formNombre} onChange={(e) => setFormNombre(e.target.value)} /></div>
            <div><label className={labelClass}>Apellido</label><input className={inputClass} value={formApellido} onChange={(e) => setFormApellido(e.target.value)} /></div>
            <div><label className={labelClass}>Cargo</label><input className={inputClass} value={formCargo} onChange={(e) => setFormCargo(e.target.value)} /></div>
            {error && <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg font-semibold text-center text-sm">{error}</div>}
            <button onClick={handleFirstRegister} className="back-button w-full text-center">Registrar</button>
          </div>
        </div>
      </div>
    );
  }

  // Login
  if (view === "login") {
    return (
      <div className="animate-fade-in max-w-md mx-auto">
        <div className="bg-card rounded-lg p-8 shadow-sm border border-border">
          <h2 className="text-2xl font-heading font-bold text-foreground mb-6 text-center">Acceso de Representante</h2>
          <div className="space-y-4 font-body">
            <div><label className={labelClass}>Número de Cédula</label>
              <input className={inputClass} value={cedula} onChange={(e) => setCedula(e.target.value)} placeholder="Ej: 12345678" onKeyDown={(e) => e.key === "Enter" && handleLogin()} />
            </div>
            {error && <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg font-semibold text-center">{error}</div>}
            <button onClick={handleLogin} className="back-button w-full text-center">Ingresar</button>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard
  if (view === "dashboard") {
    return (
      <div className="animate-fade-in">
        <BackButton onClick={() => { setView("login"); setCurrentRepresentante(null); setCedula(""); onBack(); }} />
        <div className="max-w-2xl mx-auto">
          <div className="bg-card rounded-lg p-6 shadow-sm border border-border mb-6">
            <h2 className="text-xl font-heading font-bold text-foreground mb-2">
              Bienvenido, {currentRepresentante?.nombre} {currentRepresentante?.apellido}
            </h2>
            <p className="text-sm text-muted-foreground font-body">Cargo: {currentRepresentante?.cargo}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Agregar Nuevo Representante", icon: "👤+", action: () => { clearForm(); setError(""); setSuccessMsg(""); setView("addRepresentante"); } },
              { label: "Agregar Nuevo Residente", icon: "🏠+", action: () => { clearResidenteForm(); setError(""); setSuccessMsg(""); setView("addResidente"); } },
              { label: "Data Residente", icon: "📋", action: loadResidentes },
              { label: "Data Representante", icon: "📁", action: loadRepresentantes },
            ].map((btn) => (
              <button
                key={btn.label}
                onClick={btn.action}
                className="bg-card border border-border rounded-lg p-6 text-center hover:bg-muted transition-colors shadow-sm"
              >
                <div className="text-3xl mb-2">{btn.icon}</div>
                <span className="font-body font-semibold text-foreground">{btn.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Add Representante form
  if (view === "addRepresentante") {
    return (
      <div className="animate-fade-in max-w-md mx-auto">
        <button onClick={() => setView("dashboard")} className="text-sm text-primary font-semibold mb-4 font-body">← Volver al Panel</button>
        <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
          <h2 className="text-xl font-heading font-bold text-foreground mb-4">Agregar Nuevo Representante</h2>
          <div className="space-y-3">
            <div><label className={labelClass}>Cédula</label><input className={inputClass} value={formCedula} onChange={(e) => setFormCedula(e.target.value)} /></div>
            <div><label className={labelClass}>Nombre</label><input className={inputClass} value={formNombre} onChange={(e) => setFormNombre(e.target.value)} /></div>
            <div><label className={labelClass}>Apellido</label><input className={inputClass} value={formApellido} onChange={(e) => setFormApellido(e.target.value)} /></div>
            <div><label className={labelClass}>Cargo</label><input className={inputClass} value={formCargo} onChange={(e) => setFormCargo(e.target.value)} /></div>
            {error && <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg font-semibold text-center text-sm">{error}</div>}
            {successMsg && <div className="bg-primary/10 text-primary px-4 py-3 rounded-lg font-semibold text-center text-sm">{successMsg}</div>}
            <button onClick={handleAddRepresentante} className="back-button w-full text-center">Agregar</button>
          </div>
        </div>
      </div>
    );
  }

  // Add Residente form
  if (view === "addResidente") {
    return (
      <div className="animate-fade-in max-w-md mx-auto">
        <button onClick={() => setView("dashboard")} className="text-sm text-primary font-semibold mb-4 font-body">← Volver al Panel</button>
        <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
          <h2 className="text-xl font-heading font-bold text-foreground mb-4">Agregar Nuevo Residente</h2>
          <div className="space-y-3">
            <div><label className={labelClass}>Cédula</label><input className={inputClass} value={rCedula} onChange={(e) => setRCedula(e.target.value)} /></div>
            <div><label className={labelClass}>Nombre</label><input className={inputClass} value={rNombre} onChange={(e) => setRNombre(e.target.value)} /></div>
            <div><label className={labelClass}>Apellido</label><input className={inputClass} value={rApellido} onChange={(e) => setRApellido(e.target.value)} /></div>
            <div><label className={labelClass}>Edad</label><input className={inputClass} type="number" value={rEdad} onChange={(e) => setREdad(e.target.value)} /></div>
            <div>
              <label className={labelClass}>Sexo</label>
              <select className={inputClass} value={rSexo} onChange={(e) => setRSexo(e.target.value)}>
                <option>Masculino</option><option>Femenino</option>
              </select>
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" checked={rDiscapacidad} onChange={(e) => setRDiscapacidad(e.target.checked)} className="w-5 h-5 accent-primary" />
              <label className="font-body font-semibold text-foreground">¿Posee discapacidad?</label>
            </div>
            <div>
              <label className={labelClass}>Situación Económica</label>
              <select className={inputClass} value={rSituacion} onChange={(e) => setRSituacion(e.target.value)}>
                <option>Leve</option><option>Grave</option>
              </select>
            </div>
            <div><label className={labelClass}>Hijos</label><input className={inputClass} type="number" value={rHijos} onChange={(e) => setRHijos(e.target.value)} /></div>
            {error && <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg font-semibold text-center text-sm">{error}</div>}
            {successMsg && <div className="bg-primary/10 text-primary px-4 py-3 rounded-lg font-semibold text-center text-sm">{successMsg}</div>}
            <button onClick={handleAddResidente} className="back-button w-full text-center">Agregar</button>
          </div>
        </div>
      </div>
    );
  }

  // Data Residentes
  if (view === "dataResidentes") {
    return (
      <div className="animate-fade-in">
        <button onClick={() => setView("dashboard")} className="text-sm text-primary font-semibold mb-4 font-body">← Volver al Panel</button>
        <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
          <h2 className="text-xl font-heading font-bold text-foreground mb-4">Data de Residentes</h2>
          {residentes.length === 0 ? (
            <p className="text-muted-foreground font-body text-center py-8">No hay residentes registrados</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full font-body text-sm border-collapse">
                <thead>
                  <tr className="bg-primary text-primary-foreground">
                    <th className="px-3 py-2 text-left">Nombre</th>
                    <th className="px-3 py-2 text-left">Cédula</th>
                    <th className="px-3 py-2 text-center">Edad</th>
                    <th className="px-3 py-2 text-center">Sexo</th>
                    <th className="px-3 py-2 text-center">Discap.</th>
                    <th className="px-3 py-2 text-center">Sit. Econ.</th>
                    <th className="px-3 py-2 text-center">Hijos</th>
                    <th className="px-3 py-2 text-center">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {residentes.map((r, i) => (
                    <tr key={r.id} className={i % 2 === 0 ? "bg-muted/50" : "bg-card"}>
                      <td className="px-3 py-2 text-foreground">{r.nombre} {r.apellido}</td>
                      <td className="px-3 py-2 text-muted-foreground">{r.cedula}</td>
                      <td className="px-3 py-2 text-center text-foreground">{r.edad}</td>
                      <td className="px-3 py-2 text-center text-foreground">{r.sexo}</td>
                      <td className="px-3 py-2 text-center text-foreground">{r.discapacidad ? "Sí" : "No"}</td>
                      <td className="px-3 py-2 text-center text-foreground">{r.situacion_economica}</td>
                      <td className="px-3 py-2 text-center text-foreground">{r.hijos}</td>
                      <td className="px-3 py-2 text-center">
                        <button onClick={() => deleteResidente(r.id)} className="text-destructive hover:underline text-xs font-semibold">Eliminar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Data Representantes
  if (view === "dataRepresentantes") {
    return (
      <div className="animate-fade-in">
        <button onClick={() => setView("dashboard")} className="text-sm text-primary font-semibold mb-4 font-body">← Volver al Panel</button>
        <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
          <h2 className="text-xl font-heading font-bold text-foreground mb-4">Data de Representantes</h2>
          {representantes.length === 0 ? (
            <p className="text-muted-foreground font-body text-center py-8">No hay representantes registrados</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full font-body text-sm border-collapse">
                <thead>
                  <tr className="bg-primary text-primary-foreground">
                    <th className="px-3 py-2 text-left">Nombre</th>
                    <th className="px-3 py-2 text-left">Cédula</th>
                    <th className="px-3 py-2 text-left">Cargo</th>
                    <th className="px-3 py-2 text-center">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {representantes.map((r, i) => (
                    <tr key={r.id} className={i % 2 === 0 ? "bg-muted/50" : "bg-card"}>
                      <td className="px-3 py-2 text-foreground">{r.nombre} {r.apellido}</td>
                      <td className="px-3 py-2 text-muted-foreground">{r.cedula}</td>
                      <td className="px-3 py-2 text-foreground">{r.cargo}</td>
                      <td className="px-3 py-2 text-center">
                        <button onClick={() => deleteRepresentante(r.id)} className="text-destructive hover:underline text-xs font-semibold">Eliminar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};

export default RepresentantePanel;
