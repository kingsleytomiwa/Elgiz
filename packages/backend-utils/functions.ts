import { v4 } from "uuid";
import { put } from "@vercel/blob";

export async function saveBlob(formData: FormData) {
  const file = formData.get("file");
  const name = (file as File)?.name;

  if (!name) {
    return;
  }

  const realFileName = name;
  const fileName = `${v4()}.${realFileName?.substring(realFileName?.lastIndexOf(".") + 1)}`;

  const blob = await put(fileName, file as Blob, {
    access: "public",
  });

  return blob.url;
}
