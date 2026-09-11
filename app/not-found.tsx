import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-5 sm:px-8">
      <p className="eyebrow">404 / not found</p>
      <h1 className="display mt-6 text-5xl font-semibold sm:text-6xl">
        No such release.
        <span className="block text-muted">It was never shipped.</span>
      </h1>
      <p className="mono mt-10 text-sm">
        <Link className="link" href="/">
          back to the changelog
        </Link>
      </p>
    </main>
  );
}
