import axios from "axios";

const upload = async (file: File, folderName: string): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folderName);
  try {
    const { data } = await axios.post("/api/upload", formData);
    return data.url;
  } catch (error: any) {
    console.error("Error uploading file:", error);
    throw new Error(error?.response?.data?.error || "File upload failed");
  }
};

export { upload };
