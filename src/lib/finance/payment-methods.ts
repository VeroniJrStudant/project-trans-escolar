export const PAYMENT_METHOD_OPTIONS = [
  { code: "PIX", label: "PIX" },
  { code: "BOLETO", label: "Boleto" },
  { code: "DINHEIRO", label: "Dinheiro" },
  { code: "TRANSFERENCIA", label: "Transferência" },
  { code: "CARTAO", label: "Cartão" },
  { code: "OUTRO", label: "Outro" },
] as const;

export type PaymentMethodCode = (typeof PAYMENT_METHOD_OPTIONS)[number]["code"];

export const PAYMENT_METHOD_LABEL_BY_CODE = new Map<string, string>(
  PAYMENT_METHOD_OPTIONS.map((o) => [o.code, o.label]),
);

