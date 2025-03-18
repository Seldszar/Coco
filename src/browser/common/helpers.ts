import { Money } from "~/common/types";

const dateTimeFormat = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

export function formatDateTime(input: Date | number) {
  return dateTimeFormat.format(input);
}

export function formatCurrency(input: Money) {
  const currencyFormat = new Intl.NumberFormat("en-US", {
    trailingZeroDisplay: "stripIfInteger",
    currency: input.currencyCode,
    style: "currency",
  });

  return currencyFormat.format(input.amount);
}
