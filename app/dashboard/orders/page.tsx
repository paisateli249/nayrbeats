import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

type OrderItem = {
  id: number;
  beatTitle: string;
  artist: string;
  license: string;
  price: number;
};

type DashboardOrder = {
  id: number;
  customerEmail: string;
  customerName: string | null;
  createdAt: Date;
  paymentStatus: string;
  amountTotal: number;
  currency: string;
  stripeSessionId: string;
  items: OrderItem[];
};

type MixMasterFile = {
  id: number;
  fileName: string;
  pathname: string;
  blobUrl: string;
  createdAt: Date;
};

type MixMasterOrder = {
  id: number;
  customerName: string;
  customerEmail: string;
  songTitle: string;
  notes: string | null;
  amountTotal: number;
  currency: string;
  paymentStatus: string;
  projectStatus: string;
  createdAt: Date;
  stripeSessionId: string;
  files: MixMasterFile[];
};

function formatMoney(
  amountInCents: number,
  currency: string
) {
  return new Intl.NumberFormat(
    "en-US",
    {
      style: "currency",
      currency:
        currency.toUpperCase(),
    }
  ).format(
    amountInCents / 100
  );
}

function formatDate(
  date: Date
) {
  return new Intl.DateTimeFormat(
    "en-US",
    {
      dateStyle: "medium",
      timeStyle: "short",
    }
  ).format(date);
}

export default async function OrdersPage() {
  const orders =
    (await prisma.order.findMany({
      include: {
        items: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })) as DashboardOrder[];

  const mixMasterOrders =
    (await prisma.mixMasterOrder.findMany({
      include: {
        files: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })) as MixMasterOrder[];

  const beatRevenue =
    orders.reduce(
      (
        sum,
        order
      ) =>
        sum +
        order.amountTotal,
      0
    );

  const mixMasterRevenue =
    mixMasterOrders.reduce(
      (
        sum,
        order
      ) =>
        sum +
        order.amountTotal,
      0
    );

  const totalRevenue =
    beatRevenue +
    mixMasterRevenue;

  const totalItemsSold =
    orders.reduce(
      (
        sum,
        order
      ) =>
        sum +
        order.items.length,
      0
    );

  const totalOrders =
    orders.length +
    mixMasterOrders.length;

  return (
    <main className="min-h-screen bg-[#090909] px-6 py-12 text-white">
      <div className="mx-auto max-w-7xl">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-500">
            Sales Manager
          </p>

          <h1 className="mt-2 text-4xl font-black md:text-5xl">
            Orders
          </h1>

          <p className="mt-3 text-gray-400">
            View beat purchases,
            Mix & Master bookings,
            and uploaded customer
            files.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-4">
          <StatCard
            label="Total Orders"
            value={String(
              totalOrders
            )}
            valueClassName="text-blue-500"
          />

          <StatCard
            label="Revenue"
            value={formatMoney(
              totalRevenue,
              "usd"
            )}
            valueClassName="text-green-500"
          />

          <StatCard
            label="Beat Sales"
            value={String(
              totalItemsSold
            )}
            valueClassName="text-yellow-500"
          />

          <StatCard
            label="Mix & Master"
            value={String(
              mixMasterOrders.length
            )}
            valueClassName="text-purple-400"
          />
        </div>

        <section className="mt-14">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-500">
                Services
              </p>

              <h2 className="mt-2 text-3xl font-black">
                Mix & Master Orders
              </h2>
            </div>

            <p className="text-sm text-gray-500">
              {
                mixMasterOrders.length
              }{" "}
              booking
              {mixMasterOrders.length ===
              1
                ? ""
                : "s"}
            </p>
          </div>

          {mixMasterOrders.length ===
          0 ? (
            <div className="mt-6 rounded-3xl border border-white/10 bg-[#111111] px-6 py-16 text-center">
              <h3 className="text-2xl font-black">
                No Mix & Master
                orders yet
              </h3>

              <p className="mt-3 text-gray-500">
                Paid Mix & Master
                bookings will
                appear here.
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-6">
              {mixMasterOrders.map(
                (order) => (
                  <article
                    key={order.id}
                    className="rounded-3xl border border-white/10 bg-[#111111] p-6"
                  >
                    <div className="flex flex-col gap-5 border-b border-white/10 pb-6 md:flex-row md:items-start md:justify-between">
                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-500">
                          Mix & Master
                          Order #
                          {order.id}
                        </p>

                        <h3 className="mt-2 text-2xl font-black">
                          {
                            order.songTitle
                          }
                        </h3>

                        <p className="mt-2 text-sm text-gray-400">
                          {
                            order.customerName
                          }
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          {
                            order.customerEmail
                          }
                        </p>

                        <p className="mt-3 text-sm text-gray-500">
                          {formatDate(
                            order.createdAt
                          )}
                        </p>
                      </div>

                      <div className="text-left md:text-right">
                        <div className="flex flex-wrap gap-2 md:justify-end">
                          <span className="inline-flex rounded-full bg-green-500/15 px-3 py-1 text-xs font-black uppercase tracking-wider text-green-400">
                            {
                              order.paymentStatus
                            }
                          </span>

                          <span className="inline-flex rounded-full bg-blue-500/15 px-3 py-1 text-xs font-black uppercase tracking-wider text-blue-400">
                            {
                              order.projectStatus
                            }
                          </span>
                        </div>

                        <p className="mt-3 text-3xl font-black">
                          {formatMoney(
                            order.amountTotal,
                            order.currency
                          )}
                        </p>
                      </div>
                    </div>

                    {order.notes && (
                      <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
                        <p className="text-xs font-black uppercase tracking-[0.18em] text-gray-500">
                          Customer Notes
                        </p>

                        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-300">
                          {
                            order.notes
                          }
                        </p>
                      </div>
                    )}

                    <div className="mt-6">
                      <div className="flex items-center justify-between gap-4">
                        <h4 className="font-black">
                          Uploaded Files
                        </h4>

                        <span className="text-sm text-gray-500">
                          {
                            order.files
                              .length
                          }{" "}
                          file
                          {order.files
                            .length ===
                          1
                            ? ""
                            : "s"}
                        </span>
                      </div>

                      {order.files.length ===
                      0 ? (
                        <div className="mt-4 rounded-2xl border border-dashed border-white/10 bg-black/20 p-6 text-center text-sm text-gray-500">
                          Customer has
                          not uploaded
                          files yet.
                        </div>
                      ) : (
                        <div className="mt-4 space-y-3">
                          {order.files.map(
                            (file) => (
                              <div
                                key={
                                  file.id
                                }
                                className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/20 p-4 sm:flex-row sm:items-center sm:justify-between"
                              >
                                <div className="min-w-0">
                                  <p className="truncate font-black">
                                    {
                                      file.fileName
                                    }
                                  </p>

                                  <p className="mt-1 text-xs text-gray-500">
                                    Uploaded{" "}
                                    {formatDate(
                                      file.createdAt
                                    )}
                                  </p>

                                  <p className="mt-2 break-all text-xs text-gray-600">
                                    {
                                      file.pathname
                                    }
                                  </p>
                                </div>

                                <a
                                  href={`/api/mix-master-file?fileId=${file.id}`}
                                  className="shrink-0 rounded-full bg-blue-600 px-5 py-3 text-center text-sm font-black transition hover:bg-blue-500"
                                >
                                  Download File
                                </a>
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </div>

                    <div className="mt-6 border-t border-white/10 pt-5">
                      <p className="break-all text-xs text-gray-600">
                        Stripe
                        Session:{" "}
                        {
                          order.stripeSessionId
                        }
                      </p>
                    </div>
                  </article>
                )
              )}
            </div>
          )}
        </section>

        <section className="mt-16">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-500">
                Beat Store
              </p>

              <h2 className="mt-2 text-3xl font-black">
                Beat Orders
              </h2>
            </div>

            <p className="text-sm text-gray-500">
              {orders.length} order
              {orders.length === 1
                ? ""
                : "s"}
            </p>
          </div>

          {orders.length === 0 ? (
            <div className="mt-6 rounded-3xl border border-white/10 bg-[#111111] px-6 py-20 text-center">
              <h3 className="text-2xl font-black">
                No beat orders yet
              </h3>

              <p className="mt-3 text-gray-500">
                Completed Stripe
                purchases will
                appear here.
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-6">
              {orders.map(
                (order) => (
                  <article
                    key={order.id}
                    className="rounded-3xl border border-white/10 bg-[#111111] p-6"
                  >
                    <div className="flex flex-col gap-5 border-b border-white/10 pb-6 md:flex-row md:items-start md:justify-between">
                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-500">
                          Order #
                          {order.id}
                        </p>

                        <h3 className="mt-2 text-xl font-black">
                          {
                            order.customerEmail
                          }
                        </h3>

                        {order.customerName && (
                          <p className="mt-1 text-sm text-gray-500">
                            {
                              order.customerName
                            }
                          </p>
                        )}

                        <p className="mt-3 text-sm text-gray-500">
                          {formatDate(
                            order.createdAt
                          )}
                        </p>
                      </div>

                      <div className="text-left md:text-right">
                        <span className="inline-flex rounded-full bg-green-500/15 px-3 py-1 text-xs font-black uppercase tracking-wider text-green-400">
                          {
                            order.paymentStatus
                          }
                        </span>

                        <p className="mt-3 text-3xl font-black">
                          {formatMoney(
                            order.amountTotal,
                            order.currency
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 space-y-4">
                      {order.items.map(
                        (item) => (
                          <div
                            key={
                              item.id
                            }
                            className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 sm:flex-row sm:items-center sm:justify-between"
                          >
                            <div>
                              <h4 className="font-black">
                                {
                                  item.beatTitle
                                }
                              </h4>

                              <p className="mt-1 text-sm text-gray-500">
                                {
                                  item.artist
                                }
                              </p>

                              <p className="mt-2 text-xs font-black uppercase tracking-[0.18em] text-blue-400">
                                {
                                  item.license
                                }
                              </p>
                            </div>

                            <p className="text-xl font-black">
                              {formatMoney(
                                item.price *
                                  100,
                                order.currency
                              )}
                            </p>
                          </div>
                        )
                      )}
                    </div>

                    <div className="mt-6 border-t border-white/10 pt-5">
                      <p className="break-all text-xs text-gray-600">
                        Stripe
                        Session:{" "}
                        {
                          order.stripeSessionId
                        }
                      </p>
                    </div>
                  </article>
                )
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  valueClassName: string;
}

function StatCard({
  label,
  value,
  valueClassName,
}: StatCardProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#111111] p-6">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-gray-500">
        {label}
      </p>

      <p
        className={`mt-3 text-4xl font-black ${valueClassName}`}
      >
        {value}
      </p>
    </div>
  );
}