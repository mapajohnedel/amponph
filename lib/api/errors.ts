import 'server-only'

import { NextResponse } from 'next/server'
import { ZodError } from 'zod'

export class UserFacingError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message)
    this.name = 'UserFacingError'
  }
}

export function internalErrorResponse(error: unknown, publicMessage: string) {
  console.error(publicMessage, error)
  return NextResponse.json({ error: publicMessage }, { status: 500 })
}

export function errorResponse(error: unknown, fallbackMessage: string) {
  if (error instanceof UserFacingError) {
    return NextResponse.json({ error: error.message }, { status: error.status })
  }

  if (error instanceof ZodError) {
    const message = error.issues[0]?.message ?? 'Please check the form and try again.'
    return NextResponse.json({ error: message }, { status: 400 })
  }

  if (error instanceof SyntaxError) {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  return internalErrorResponse(error, fallbackMessage)
}
