import prisma from "@/lib/prisma";

export const runtime = "nodejs";

const allowedStatuses = [
  "new",
  "in-progress",
  "ready",
  "completed",
] as const;

type ProjectStatus =
  (typeof allowedStatuses)[number];

interface UpdateStatusBody {
  orderId: number;
  status: ProjectStatus;
}

export async function POST(
  request: Request
) {
  try {
    const body =
      (await request.json()) as UpdateStatusBody;

    const {
      orderId,
      status,
    } = body;

    if (
      !Number.isInteger(orderId) ||
      orderId <= 0
    ) {
      return Response.json(
        {
          error:
            "A valid Mix & Master order ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !allowedStatuses.includes(
        status
      )
    ) {
      return Response.json(
        {
          error:
            "Invalid project status.",
        },
        {
          status: 400,
        }
      );
    }

    const existingOrder =
      await prisma.mixMasterOrder.findUnique({
        where: {
          id: orderId,
        },
      });

    if (!existingOrder) {
      return Response.json(
        {
          error:
            "Mix & Master order not found.",
        },
        {
          status: 404,
        }
      );
    }

    const updatedOrder =
      await prisma.mixMasterOrder.update({
        where: {
          id: orderId,
        },

        data: {
          projectStatus:
            status,
        },
      });

    return Response.json({
      success: true,

      order: {
        id:
          updatedOrder.id,

        projectStatus:
          updatedOrder.projectStatus,
      },
    });
  } catch (error) {
    console.error(
      "Mix & Master status update error:",
      error
    );

    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to update project status.",
      },
      {
        status: 500,
      }
    );
  }
}