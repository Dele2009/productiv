import { AnySchema, ValidationError } from 'yup'

export async function validateSchema<T>(
  schema: AnySchema,
  data: unknown
): Promise<{ data: T | null; errors: { path: string; message: string }[] | null }> {
  try {
    const parsed = await schema.validate(data, { abortEarly: false })
    return { data: parsed, errors: null }
  } catch (error) {
    if (error instanceof ValidationError) {
      const errors = error.inner.map(err => ({
        path: err.path || '',
        message: err.message,
      }))
      return { data: null, errors }
    }

    throw error // let other errors bubble up
  }
}
