import { useEffect } from "react";
import QRCode from "react-qr-code";
import { useOnSiteRegisterForm } from "../../store/onsite-register-form";
import "./PrintableLabel.css";

export function PrintableLabel() {
  const { printableLabel } = useOnSiteRegisterForm();

  useEffect(() => {
    if (!printableLabel) {
      window.location.replace("/registro-en-sitio");
      return;
    }

    const timer = setTimeout(() => {
      window.print();
    }, 500);

    return () => clearTimeout(timer);
  }, [printableLabel]);

  if (!printableLabel) return null;

  return (
    <main className="label-page">
      <section className="print-label">
        <div className="label-content">
          <div>
            <h1>
              {printableLabel.name} {printableLabel.paternSurname}
            </h1>
            <p className="text-rol">{printableLabel.company}</p>
            <p>{printableLabel.position}</p>
          </div>
        </div>

        <div className="label-footer">
          <div className="label-type">
            <p>{printableLabel.typeRegister}</p>
          </div>
          <div className="qr-box">
            <QRCode
              value={String(printableLabel.qr)}
              size={56}
              bgColor="#ffffff"
              fgColor="#000000"
              level="M"
            />
          </div>
        </div>
      </section>

      <div className="no-print print-actions">
        <button type="button" onClick={() => window.print()}>
          Imprimir etiqueta
        </button>

        <a href="/registro-en-sitio">Nuevo registro</a>
      </div>
    </main>
  );
}
