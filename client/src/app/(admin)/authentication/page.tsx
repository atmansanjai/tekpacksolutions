import GoogleButton from "@/app/(admin)/authentication/components/GoogleButton";
import { FaUserLarge } from "react-icons/fa6";

export default function Authentication() {
    return (
        <section
            className={
                "bg-background text-foreground/80 flex h-screen w-screen items-center justify-center"
            }
        >
            <div
                className={
                    "flex w-2/3 flex-col items-center justify-center gap-5 bg-white p-20"
                }
            >
                <FaUserLarge className={"text-6xl"} />
                <h1 className={"text-center text-5xl font-semibold"}>
                    <span className={"text-foreground/40"}>
                        Automate Your Productivity <br /> with
                    </span>
                    <span className={"text-foreground/80 ml-2"}>
                        Tekpack Solutions
                    </span>
                </h1>
                <GoogleButton />
                <p
                    className={
                        "text-foreground/50 w-1/2 text-center text-xs font-medium"
                    }
                >
                    By continuing with Google, you agree to our Terms of Service
                    and acknowledge that you have read our Privacy Policy.
                </p>
            </div>
        </section>
    );
}
