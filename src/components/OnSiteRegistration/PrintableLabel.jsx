import { useEffect, useMemo } from "react";
import QRCode from "react-qr-code";
import { useOnSiteRegisterForm } from "../../store/onsite-register-form";
import { useStaffRegisterForm } from "../../store/staff-register-form";

import "./PrintableLabel.css";

export function PrintableLabel({ source = "onsite", copies = 2 }) {
  const onsiteLabel = useOnSiteRegisterForm((state) => state.printableLabel);
  const staffLabel = useStaffRegisterForm((state) => state.printableLabel);
  const onsiteLabels = useOnSiteRegisterForm((state) => state.printableLabels);
  const staffLabels = useStaffRegisterForm((state) => state.printableLabels);

  const printableLabel = source === "staff" ? staffLabel : onsiteLabel;
  const printableLabels = source === "staff" ? staffLabels : onsiteLabels;
  const labels = useMemo(
    () => {
      const baseLabels = printableLabels?.length ? printableLabels : printableLabel ? [printableLabel] : [];
      return baseLabels.flatMap(label => Array(copies).fill(label));
    },
    [printableLabels, printableLabel, copies],
  );

  const returnPath =
    source === "staff" ? "/registro-operativo" : "/registro-en-sitio";

  useEffect(() => {
    if (labels.length === 0) {
      window.location.replace(returnPath);
      return;
    }

    const timer = setTimeout(() => {
      window.print();
    }, 500);

    return () => clearTimeout(timer);
  }, [labels, returnPath]);

  if (labels.length === 0) return null;

  return (
    <main className="label-page">
      <div className="label-list">
        {labels.map((label, index) => (
          <section className="print-label" key={`${label.qr}-${index}`}>
            <div className="label-content">
              <div>
                <h1>
                  {label.name} {label.paternSurname}
                </h1>
                <p className="text-rol">{label.company}</p>
                <p>{label.position}</p>
              </div>
            </div>

            <div className="label-footer">
              <div className="label-type">
                <p>{label.typeRegister}</p>
              </div>
              <div className="qr-box">
                <QRCode
                  value={String(label.qr)}
                  size={56}
                  bgColor="#ffffff"
                  fgColor="#000000"
                  level="M"
                />
              </div>
            </div>
          </section>
        ))}
      </div>

      <div className="no-print print-actions">
        <button type="button" onClick={() => window.print()}>
          {labels.length === 1 ? "Imprimir etiqueta" : `Imprimir ${labels.length} etiquetas`}
        </button>

        <a href={returnPath}>Nuevo registro</a>
      </div>
    </main>
  );
}
