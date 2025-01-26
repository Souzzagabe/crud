import { todoController } from '@/server/controller/todo';
import { NextResponse, NextRequest } from 'next/server';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Verifique se o método é PUT
    if (request.method !== 'PUT') {
      return NextResponse.json(
        { error: { message: "method is not allowed." } },
        { status: 405 } // Method Not Allowed
      );
    }

    const response = await todoController.toggleDone(request);

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: { message: "An error occurred in the PUT handler." } },
      { status: 500 }
    );
  }
}
