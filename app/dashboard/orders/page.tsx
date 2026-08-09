import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

function formatMoney(amountInCents: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amountInCents / 100);
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default async function OrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      items: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const totalRevenue = orders.reduce(
    (sum, order) => sum + order.amountTotal,
    0
  );

  return (
    <main className="min-h-screen bg-[#090909] px-6 py-10 text-white lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.3em] text-blue-500">
            Sales Manager
          </p>

          <h1 className="mt-2 text-4xl font-black md:text-5xl">
            Orders
          </h1>

          <p className="mt-3 text-gray-400">
            View completed purchases and customer order details.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <StatCard
            label="Total Orders"
            value={String(orders.length)}
            valueClassName="text-blue-500"
          />

          <StatCard
            label="Revenue"
            value={formatMoney(totalRevenue, "usd")}
            valueClassName="text-green-500"
          />

          <StatCard
            label="Items Sold"
            value={String(
              orders.reduce(
                (sum, order) => sum + order.items.length,
                0
              )
            )}
            valueClassName="text-yellow-500"
          />
        </div>

        {orders.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-white/10 bg-[#111111] px-6 py-20 text-center">
            <h2 className="text-2xl font-black">
              No orders yet
            </h2>

            <p className="mt-3 text-gray-500">
              Completed Stripe purchases will appear here.
            </p>
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            {orders.map((order) => (
              <article
                key={order.id}
                className="rounded-3xl border border-white/10 bg-[#111111] p-6"
              >
                <div className="flex flex-col gap-5 border-b border-white/10 pb-6 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-500">
                      Order #{order.id}
                    </p>

                    <h2 className="mt-2 text-xl font-black">
                      {order.customerEmail}
                    </h2>

                    {order.customerName && (
                      <p className="mt-1 text-sm text-gray-500">
                        {order.customerName}
                      </p>
                    )}

                    <p className="mt-3 text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>

                  <div className="text-left md:text-right">
                    <span className="inline-flex rounded-full bg-green-500/15 px-3 py-1 text-xs font-black uppercase tracking-wider text-green-400">
                      {order.paymentStatus}
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
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <h3 className="font-black">
                          {item.beatTitle}
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          {item.artist}
                        </p>

                        <p className="mt-2 text-xs font-black uppercase tracking-[0.18em] text-blue-400">
                          {item.license}
                        </p>
                      </div>

                      <p className="text-xl font-black">
                        {formatMoney(
                          item.price * 100,
                          order.currency
                        )}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 border-t border-white/10 pt-5">
                  <p className="break-all text-xs text-gray-600">
                    Stripe Session: {order.stripeSessionId}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
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

      <p className={`mt-3 text-4xl font-black ${valueClassName}`}>
        {value}
      </p>
    </div>
  );
}