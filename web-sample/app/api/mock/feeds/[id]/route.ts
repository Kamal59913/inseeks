import { NextRequest, NextResponse } from "next/server";

const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const body = await request.json();

  await sleep(350);

  return NextResponse.json({
    status: true,
    message: "Feed updated successfully",
    data: {
      id,
      ...body,
      updated_at: new Date().toISOString(),
      mocked: true,
    },
  });
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  await sleep(350);

  return NextResponse.json({
    status: true,
    message: "Feed deleted successfully",
    data: {
      id,
      mocked: true,
    },
  });
}
