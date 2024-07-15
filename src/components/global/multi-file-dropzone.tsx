"use client";

import { UploadCloudIcon, X } from "lucide-react";
import * as React from "react";
import { useDropzone, type DropzoneOptions } from "react-dropzone";
import { twMerge } from "tailwind-merge";
import { toast } from "sonner";
import { ConfirmModal } from "@/components/modals/confirm-modal";

const variants = {
  base: "relative rounded-md p-4 w-96 max-w-[calc(100vw-1rem)] flex justify-center items-center flex-col cursor-pointer border border-dashed border-gray-400 dark:border-gray-300 transition-colors duration-200 ease-in-out",
  active: "border-2",
  disabled:
    "bg-gray-200 border-gray-300 cursor-default pointer-events-none bg-opacity-30 dark:bg-gray-700 dark:border-gray-600",
  accept: "border border-blue-500 bg-blue-500 bg-opacity-10",
  reject: "border border-red-700 bg-red-700 bg-opacity-10",
};

type InputProps = {
  className?: string;
  onChange?: (files: File[]) => void | Promise<void>;
  onFilesAdded?: (addedFiles: File[]) => void | Promise<void>;
  disabled?: boolean;
  dropzoneOptions?: Omit<DropzoneOptions, "disabled">;
  multiple?: boolean;
  setUploadedFile: (file: File | null) => void;
};

const ERROR_MESSAGES = {
  fileTooLarge(maxSize: number) {
    return `The file is too large. Max size is ${formatFileSize(maxSize)}.`;
  },
  fileInvalidType() {
    return "Invalid file type.";
  },
  tooManyFiles(maxFiles: number) {
    return `You can only add ${maxFiles} file(s).`;
  },
  fileNotSupported() {
    return "The file is not supported.";
  },
};

type UploadedFileData = {
  id: string;
  file: File;
};

const MultiFileDropzone = ({
  dropzoneOptions,
  className,
  disabled,
  multiple,
  onFilesAdded,
  onChange,
  setUploadedFile,
}: InputProps) => {
  const [customError, setCustomError] = React.useState<string>();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [uploadedFiles, setUploadedFiles] = React.useState<UploadedFileData[]>(
    [],
  );

  if (dropzoneOptions?.maxFiles && uploadedFiles?.length) {
    disabled = disabled ?? uploadedFiles.length >= dropzoneOptions.maxFiles;
  }

  const onDelete = async (fileId: string) => {
    if (!fileId || loading) return;

    // Set loading state to true
    setLoading(true);

    try {
      // Remove the file with the given ID from the uploadedFiles state
      setUploadedFiles((prevFiles) =>
        prevFiles.filter((uploadedFile) => uploadedFile.id !== fileId),
      );
      setUploadedFile(null);

      // Show a success toast message
      toast.success("File deleted successfully!");
    } catch (error) {
      // Handle any errors during file deletion
      toast.error("Failed to delete the file.");
      console.error("Error deleting file:", error);
    } finally {
      // Set loading state to false
      setLoading(false);
    }
  };

  // dropzone configuration
  const {
    getRootProps,
    getInputProps,
    fileRejections,
    isFocused,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    disabled,
    multiple: multiple,
    onDrop: (acceptedFiles) => {
      const files = acceptedFiles;
      setCustomError(undefined);
      if (
        dropzoneOptions?.maxFiles &&
        (uploadedFiles?.length ?? 0) + files.length > dropzoneOptions.maxFiles
      ) {
        setCustomError(ERROR_MESSAGES.tooManyFiles(dropzoneOptions.maxFiles));
        return;
      }
      if (files) {
        files.forEach((file) => {
          const reader = new FileReader();
          reader.onabort = () => console.log("File reading was aborted");
          reader.onerror = () => console.log("File reading has failed");

          reader.onload = async () => {
            await uploadFile(file);
          };
          reader.readAsArrayBuffer(file);
        });
        void onFilesAdded?.(files);
        void onChange?.([...files]);
      }
    },
    ...dropzoneOptions,
  });

  const uploadFile = async (selectedFile: File) => {
    if (loading) return;

    // Set loading state to true
    setLoading(true);

    try {
      // Create a unique ID for the uploaded file
      const fileId = Date.now().toString();

      // Add the file to the state
      setUploadedFiles((prevFiles) =>
        prevFiles.concat({ id: fileId, file: selectedFile }),
      );

      // Show a success message
      toast.success("File added successfully!");
    } catch (error) {
      // Handle any errors during file upload
      toast.error("Failed to add the file.");
      console.error("Error adding file:", error);
    } finally {
      // Set loading state to false
      setLoading(false);
    }
  };

  // styling
  const dropZoneClassName = React.useMemo(
    () =>
      twMerge(
        variants.base,
        isFocused && variants.active,
        disabled && variants.disabled,
        (isDragReject ?? fileRejections[0]) && variants.reject,
        isDragAccept && variants.accept,
        className,
      ).trim(),
    [
      isFocused,
      fileRejections,
      isDragAccept,
      isDragReject,
      disabled,
      className,
    ],
  );

  // error validation messages
  const errorMessage = React.useMemo(() => {
    if (fileRejections[0]) {
      const { errors } = fileRejections[0];
      if (errors[0]?.code === "file-too-large") {
        return ERROR_MESSAGES.fileTooLarge(dropzoneOptions?.maxSize ?? 0);
      } else if (errors[0]?.code === "file-invalid-type") {
        return ERROR_MESSAGES.fileInvalidType();
      } else if (errors[0]?.code === "too-many-files") {
        return ERROR_MESSAGES.tooManyFiles(dropzoneOptions?.maxFiles ?? 0);
      } else {
        return ERROR_MESSAGES.fileNotSupported();
      }
    }
    return undefined;
  }, [fileRejections, dropzoneOptions]);

  return (
    <div className="">
      <div className="flex flex-col gap-2">
        <div>
          {/* Main File Input */}
          <div
            {...getRootProps({
              className: `border-2 border-dashed hover:cursor-pointer hover:border-muted-foreground ${dropZoneClassName}`,
            })}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center text-xs text-gray-400">
              <UploadCloudIcon className="mb-1 h-7 w-7" />
              <div className="text-gray-400">
                Drag & drop or click here to upload
              </div>
            </div>
          </div>
          {/* Error Text */}
          <div className="mt-1 text-xs text-red-500">
            {customError ?? errorMessage}
          </div>
          {/* Uploaded files info */}
          <div className="mt-4">
            {uploadedFiles.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-2">Uploaded Files</h2>
                <ul className="divide-y divide-gray-200">
                  {uploadedFiles.map((uploadedFile, index) => (
                    <li
                      key={index}
                      className="py-2 flex items-center justify-between"
                    >
                      <span className="text-gray-600">
                        {uploadedFile.file.name}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 text-sm">
                          {formatFileSize(uploadedFile.file.size)}
                        </span>
                        <ConfirmModal
                          header="Delete File?"
                          description="This will delete file completely."
                          disabled={loading}
                          onConfirm={() => {
                            onDelete(uploadedFile.id);
                          }}
                        >
                          <X className="w-4 h-4 cursor-pointer text-red-500" />
                        </ConfirmModal>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
MultiFileDropzone.displayName = "MultiFileDropzone";

function formatFileSize(bytes?: number) {
  if (!bytes) {
    return "0 Bytes";
  }
  bytes = Number(bytes);
  if (bytes === 0) {
    return "0 Bytes";
  }
  const k = 1024;
  const dm = 2;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export { MultiFileDropzone };
