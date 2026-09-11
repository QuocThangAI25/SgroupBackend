import { BadRequestError } from "../core/error.response.js";

export const parseId = (id) => {
  const parsedId = Number(id);
  if (
    !id ||
    Number.isNaN(parsedId) ||
    !Number.isInteger(parsedId) ||
    parsedId <= 0
  ) {
    throw new BadRequestError(
      "Invalid ID format. ID must be a positive integer.",
    );
  }
  return parsedId;
};
