import { Add } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { useFormikContext } from "formik";
import Image from "next/image";
import React from "react";

export const imageUploadError = "Пожалуйста, загрузите .png или .jpg картинку";
export const getFileExtension = (fileName: string) => fileName.split(".").pop();

const Dropzone = ({ name }: { name: string; }) => {
  const [isBeingDragged, setIsBeingDragged] = React.useState(false);
  const {
    setFieldValue,
    setFieldError,
    errors: formErrors,
    values
  } = useFormikContext();

  const validateFile = (currentFile?: File) => {
    const fileExtension = currentFile?.name && getFileExtension(currentFile?.name);
    const isFileExtensionFits = fileExtension === "jpg" || fileExtension === "png" || fileExtension === "jpeg";

    if (!currentFile || !isFileExtensionFits) {
      setFieldError(name, imageUploadError);
      return;
    }
    setFieldError(name, undefined);

    setFieldValue(name, currentFile);
  };

  const onFilesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const currentFile = event?.target?.files?.[0];
    validateFile(currentFile);
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsBeingDragged(true);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const currentFile = e.dataTransfer.files[0];
    validateFile(currentFile);

    setIsBeingDragged(false);
  };

  // const error = (formErrors?.file ?? "") as string;

  const getBorderColor = (): string => {
    // if (isDisabled) {
    //   return "border-purple-300";
    // }

    if (isBeingDragged) {
      return "purple";
    }

    return formErrors[name] ? "red" : "lightgrey";
  };

  // TODO! Research, why its not everywhere possible to change by clicking (works only DnD)

  return (
    <Box>
      <Box
        onDragOver={onDragOver}
        onDrop={handleDrop}
        sx={{
          width: "150px",
          height: "150px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          position: "relative",
          backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='20' ry='20' stroke='${getBorderColor()}' stroke-width='5' stroke-dasharray='9' stroke-dashoffset='0' stroke-linecap='butt'/%3e%3c/svg%3e")`,
          borderRadius: "20px",
          zIndex: 10
        }}
      >
        <>
          {values?.[name] && (
            <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}>
              <Image
                src={typeof values[name] === "string" ? values[name] : URL.createObjectURL(values[name])}
                width={150}
                height={150}
                alt="Preview"
                loading="lazy"
                style={{ borderRadius: "10px" }}
              />
            </Box>)}
          <label
            htmlFor={name}
            style={{ width: "100%", height: "100%", opacity: 0, cursor: "pointer" }}
          >
            <input
              id={name}
              name={name}
              accept=".jpg,.jpeg,.png"
              type="file"
              className="hidden"
              onChange={onFilesChange}
            />
          </label>
        </>

        <Add sx={{ position: "absolute", top: "50%", left: "50%", translate: "-50% -50%", fontSize: "120px", scale: 2, color: getBorderColor(), zIndex: -1 }} />
      </Box>
      <Typography sx={{ fontSize: "12px", color: "red", fontWeight: 500, mt: 0.5 }}>
        {formErrors[name]}
      </Typography>
    </Box>
  );
};
export default Dropzone;
