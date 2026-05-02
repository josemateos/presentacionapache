import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";

interface Conector {
  auxiliar: string;
  tiempoVerbal: string;
  traduccionLiteral: string;
  fraseEnsenanza: string;
  personaGramatical: string;
  sabesDecir: string;
  apacheEspanol: string;
  ejemploIngles: string;
}

const CONECTORES: Conector[] = [
  { auxiliar: "a", tiempoVerbal: "", traduccionLiteral: "un / una", fraseEnsenanza: "a, antes de consonante", personaGramatical: "todas", sabesDecir: "Ella tiene un carro", apacheEspanol: "Ella tener → carro", ejemploIngles: "She has a car" },
  { auxiliar: "some", tiempoVerbal: "", traduccionLiteral: "unos / unas", fraseEnsenanza: "Significa: una cantidad indeterminada (algunos).", personaGramatical: "todas", sabesDecir: "Yo tengo unos libros", apacheEspanol: "Yo tener → libros", ejemploIngles: "I have some books" },
  { auxiliar: "is", tiempoVerbal: "Presente", traduccionLiteral: "ser / estar", fraseEnsenanza: "Significa: es o está.", personaGramatical: "él, ella, eso", sabesDecir: "Él está listo", apacheEspanol: "Él estar listo", ejemploIngles: "He is ready" },
  { auxiliar: "are", tiempoVerbal: "Presente", traduccionLiteral: "ser / estar", fraseEnsenanza: "Significa: estas, están... o eres...", personaGramatical: "tú, uds, nos, ellos", sabesDecir: "Tú estás bien", apacheEspanol: "Tú estar bien", ejemploIngles: "You are ok" },
  { auxiliar: "am", tiempoVerbal: "Presente", traduccionLiteral: "ser / estar", fraseEnsenanza: "Significa: soy o estoy.", personaGramatical: "yo", sabesDecir: "Yo estoy feliz", apacheEspanol: "Yo estar feliz", ejemploIngles: "I am happy" },
  { auxiliar: "does", tiempoVerbal: "Presente", traduccionLiteral: "hacer", fraseEnsenanza: "Significa: Hacer para él/ella, en presente.", personaGramatical: "él, ella, eso", sabesDecir: "Ella → sabe", apacheEspanol: "Ella hacer saber", ejemploIngles: "She does know" },
  { auxiliar: "do", tiempoVerbal: "", traduccionLiteral: "hacer", fraseEnsenanza: "Significa: Ayuda a formar preguntas y Yo si hacer...", personaGramatical: "yo, tú, nos, uds, ellos", sabesDecir: "¿Te gusta?\n¡Sí queremos ir!", apacheEspanol: "Hacer tú gustar\nNosotros sí hacer querer ir", ejemploIngles: "Do you like?\nWe do want to go" },
  { auxiliar: "be", tiempoVerbal: "", traduccionLiteral: "ser / estar", fraseEnsenanza: "Significa literalmente: 'ser/estar'.", personaGramatical: "todas las personas", sabesDecir: "Quiero ser maestro", apacheEspanol: "Yo querer ser maestro", ejemploIngles: "I want to be a teacher" },
  { auxiliar: "will", tiempoVerbal: "Futuro confirmado (sucederá)", traduccionLiteral: "are, ire...", fraseEnsenanza: "Significa: Terminacion del futuro.", personaGramatical: "todas las personas", sabesDecir: "Yo jugaré", apacheEspanol: "Yo jugar", ejemploIngles: "I will play" },
  { auxiliar: "the", tiempoVerbal: "", traduccionLiteral: "el / la / los / las", fraseEnsenanza: "Significa: El, la, los, las. Objeto específico.", personaGramatical: "todas", sabesDecir: "Yo leí el libro", apacheEspanol: "Yo leer → libro", ejemploIngles: "I read the book" },
  { auxiliar: "an", tiempoVerbal: "", traduccionLiteral: "un / una", fraseEnsenanza: "an, antes de vocal", personaGramatical: "todas", sabesDecir: "Él vio un elefante", apacheEspanol: "Él ver → elefante", ejemploIngles: "He saw an elephant" },
  { auxiliar: "and", tiempoVerbal: "", traduccionLiteral: "y", fraseEnsenanza: "Significa: unión de dos ideas.", personaGramatical: "todas", sabesDecir: "Tú y yo", apacheEspanol: "Tú y yo", ejemploIngles: "You and I" },
  { auxiliar: "but", tiempoVerbal: "", traduccionLiteral: "pero", fraseEnsenanza: "Significa: oposición de ideas.", personaGramatical: "todas", sabesDecir: "Pero no puedo", apacheEspanol: "Pero yo no poder", ejemploIngles: "But I can't" },
  { auxiliar: "any", tiempoVerbal: "", traduccionLiteral: "ningún / algún", fraseEnsenanza: "Se usa principalmente para negar o preguntar.", personaGramatical: "todas", sabesDecir: "¿Tienes alguna duda?", apacheEspanol: "¿Hacer tú tener algún duda?", ejemploIngles: "Do you have any doubt?" },
  { auxiliar: "there is / there are", tiempoVerbal: "Presente", traduccionLiteral: "hay", fraseEnsenanza: "Para decir que algo existe en un lugar.", personaGramatical: "todas", sabesDecir: "Hay un hombre ahí", apacheEspanol: "Hay -> hombre ahí", ejemploIngles: "There is a man there" },
  { auxiliar: "what", tiempoVerbal: "", traduccionLiteral: "lo que", fraseEnsenanza: "Conecta ideas de información en la frase.", personaGramatical: "todas", sabesDecir: "Sé lo que quieres", apacheEspanol: "Yo saber lo que tú querer", ejemploIngles: "I know what you want" },
];

const Field = ({ label, value }: { label: string; value: string }) => {
  if (!value) return null;
  return (
    <div className="space-y-1">
      <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">
        {label}
      </p>
      <p className="text-sm text-foreground whitespace-pre-line">{value}</p>
    </div>
  );
};

const ConectoresSimples = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Conector | null>(null);

  return (
    <div className="min-h-screen bg-background pb-6">
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/auxiliaries")}
            className="shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground">
              Conectores Simples
            </h1>
            <p className="text-sm text-muted-foreground">
              Toca un auxiliar para ver sus características
            </p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {CONECTORES.map((c, idx) => (
            <motion.div
              key={c.auxiliar}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.03 }}
            >
              <Card className="overflow-hidden">
                <Button
                  variant="outline"
                  className="w-full h-auto py-4 px-3 border-0 hover:bg-muted"
                  onClick={() => setSelected(c)}
                >
                  <span className="font-bold text-base text-primary text-center w-full break-words">
                    {c.auxiliar}
                  </span>
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      </main>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl text-primary">
              {selected?.auxiliar}
            </DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4 pt-2">
              <Field label="Tiempo verbal" value={selected.tiempoVerbal} />
              <Field label="Traducción literal" value={selected.traduccionLiteral} />
              <Field label="Significado" value={selected.fraseEnsenanza} />
              <Field label="Persona gramatical" value={selected.personaGramatical} />
              <Field label="Sabes decir" value={selected.sabesDecir} />
              <Field label="Apache Español" value={selected.apacheEspanol} />
              <Field label="Ejemplo en Inglés" value={selected.ejemploIngles} />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ConectoresSimples;
