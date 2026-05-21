export default function Loading() {
    return (
        <section className="flex h-full w-full flex-col items-center justify-center">
            <div className={"h-15 w-full animate-pulse bg-neutral-200"}></div>
            <div className={"grid w-full flex-1 grid-cols-3 gap-3 p-3"}>
                {[...Array(12)].map((_, index) => (
                    <div
                        className={
                            "flex h-20 h-full w-full animate-pulse items-center justify-center bg-neutral-200 p-3"
                        }
                        key={index}
                    >
                        <div
                            className={
                                "h-14 h-full w-25 animate-pulse bg-neutral-300"
                            }
                        ></div>
                        <div
                            className={
                                "flex h-full flex-1 animate-pulse flex-col items-center justify-center gap-3 p-3"
                            }
                        >
                            <div
                                className={
                                    "h-5 w-full animate-pulse bg-neutral-300"
                                }
                            ></div>
                            <div
                                className={
                                    "h-5 w-full animate-pulse bg-neutral-300"
                                }
                            ></div>
                            <div
                                className={
                                    "h-5 w-full animate-pulse bg-neutral-300"
                                }
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
            <div className={"h-15 w-full animate-pulse bg-neutral-200"}></div>
        </section>
    );
}
