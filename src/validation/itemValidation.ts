export interface ValidItemData {
  name: string;
  quantity: number;
  purchased: boolean;
}

export function validateNewItem(body: unknown): { errors: string[]; data?: ValidItemData } {
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return { errors: ['Request body must be a JSON object'] };
  }

  const { name, quantity, purchased } = body as Record<string, unknown>;
  const errors: string[] = [];

  if (typeof name !== 'string' || name.trim() === '') {
    errors.push('name is required and must be a non-empty string');
  }

  if (
    quantity !== undefined &&
    (typeof quantity !== 'number' || !Number.isInteger(quantity) || quantity < 1)
  ) {
    errors.push('quantity must be a whole number of 1 or more');
  }

  if (purchased !== undefined && typeof purchased !== 'boolean') {
    errors.push('purchased must be true or false');
  }

  if (errors.length > 0) {
    return { errors };
  }

  return {
    errors,
    data: {
      name: (name as string).trim(),
      quantity: (quantity as number | undefined) ?? 1,
      purchased: (purchased as boolean | undefined) ?? false,
    },
  };
}