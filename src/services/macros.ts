export function ErrorToast(error: string) {
  console.error(error);
  useToast().add({ title: error, color: "error" });
}
