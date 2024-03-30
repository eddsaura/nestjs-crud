import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  return (
    <div class="flex items-center justify-center">
      <h1>My g what up</h1>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Do you want your hype piece? Earn it.",
  meta: [
    {
      name: "description",
      content:
        "Scan, talk, be a fucking human and earn your hyped trending piece of ssssh..art.",
    },
  ],
};
