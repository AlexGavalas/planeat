'use client';
export default function ErrorPage({
    reset: handleReset,
}: Readonly<{ reset: () => void }>) {
    return (
        <div role="alert">
            <p>Something went wrong.</p>
            <button onClick={handleReset} type="button">
                Try again
            </button>
        </div>
    );
}
