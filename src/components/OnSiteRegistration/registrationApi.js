const getRegistrationApiBase = () =>
  import.meta.env.DEV
    ? "http://localhost:3005/"
    : "https://smarttechnologyexpo.mx/server/";

const parseResponse = async (response) => {
  const data = await response.json();

  if (!response.ok || !data?.status) {
    throw new Error(data?.message || "No se pudo completar la operacion.");
  }

  return data;
};

export const searchRegistrations = async (query) => {
  const response = await fetch(
    `${getRegistrationApiBase()}onsite-registration-search?q=${encodeURIComponent(query)}`,
  );
  const data = await parseResponse(response);
  return Array.isArray(data.records) ? data.records : [];
};

export const getRegistrationByUuid = async (uuid, source = "main") => {
  const response = await fetch(
    `${getRegistrationApiBase()}onsite-registration/${encodeURIComponent(uuid)}?source=${encodeURIComponent(source)}`,
  );
  const data = await parseResponse(response);
  return data.visitor;
};

export const updateRegistration = async (uuid, payload, source = "main") => {
  const response = await fetch(
    `${getRegistrationApiBase()}onsite-registration/${encodeURIComponent(uuid)}?source=${encodeURIComponent(source)}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );

  const data = await parseResponse(response);
  return data.visitor;
};

export const markRegistrationPrinted = async (uuid, source = "main") => {
  const response = await fetch(
    `${getRegistrationApiBase()}onsite-registration/${encodeURIComponent(uuid)}/print?source=${encodeURIComponent(source)}`,
    {
      method: "POST",
    },
  );

  const data = await parseResponse(response);
  return data.visitor;
};
