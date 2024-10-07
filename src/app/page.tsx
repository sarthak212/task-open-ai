import { Metadata } from "next";

// import { z } from "zod";

// import { taskSchema } from "../validation/schema/table";

import { AuthProvider } from "@/components/authprovider";
import { Providers } from "./providers";
import { WrapperClient } from "@/components/WrapperClient";

export const metadata: Metadata = {
  title: "Tasks",
  description: "A task and issue tracker build using Tanstack Table.",
};

// Simulate a database read for tasks.
async function getTasks() {
  // return z.array(taskSchema).parse(tasks);
}

export default async function Home({}) {
  return (
    <AuthProvider>
      <Providers>
        <div className="md:hidden"></div>

        <WrapperClient />
      </Providers>
    </AuthProvider>
  );
}
