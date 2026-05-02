import { useState, useRef } from "react";
import { X, Upload, Download, FileText, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Modal } from "../../ui/modal";
import Button from "../../ui/button/Button";
import { ToastService } from "../../../utils/toastService";
import freelancersApplicationService from "../../../api/services/freelancersApplicationService";
import { useModalData } from "../../../redux/hooks/useModal";
import Tooltip from "../../ui/tooltip/tooltip";

interface Props {
  modalId: string;
  data?: any;
}

interface ImportError {
  row: number;
  email: string;
  error: string;
}

interface ImportResults {
  total_rows: number;
  imported_count: number;
  skipped_count: number;
  errors: ImportError[];
}

const ImportFreelancersModal: React.FC<Props> = () => {
  const { close } = useModalData();
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [results, setResults] = useState<ImportResults | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== "text/csv" && !selectedFile.name.endsWith(".csv")) {
        ToastService.error("Please select a valid CSV file");
        return;
      }
      setFile(selectedFile);
      setStatus("idle");
      setErrorMessage(null);
      setResults(null);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const response = await freelancersApplicationService.importFreelancerTemplate();
      if (response.status === 200) {
        const fileData = response?.data?.data;
        if (!fileData?.download_url) {
          throw new Error("Download URL not found");
        }

        const link = document.createElement("a");
        link.href = fileData.download_url;
        link.download = fileData.filename || "freelancer-import-template.csv";
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        ToastService.success("Template download started");
      }
    } catch (error: any) {
      ToastService.error("Failed to download template");
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setStatus("uploading");
    setResults(null);
    try {
      const response = await freelancersApplicationService.importFreelancers(file);
      if (response.status === 200 || response.status === 201) {
        setStatus("success");
        const importData = response.data?.data;
        if (importData) {
          setResults({
            total_rows: importData.total_rows,
            imported_count: importData.imported_count,
            skipped_count: importData.skipped_count,
            errors: importData.errors || []
          });
        }
        
        if (importData?.imported_count > 0 && importData?.errors?.length === 0) {
          ToastService.success(response.data?.message || "Freelancers imported successfully");
          setTimeout(() => {
            close();
            setFile(null);
            setStatus("idle");
          }, 2000);
        } else if (importData?.errors?.length > 0) {
          ToastService.success("Import completed with some errors");
        }
      } else {
        setStatus("error");
        setErrorMessage(response?.data?.message || "Failed to import freelancers");
      }
    } catch (error: any) {
      setStatus("error");
      setErrorMessage("An error occurred during upload");
      ToastService.error("Upload failed");
    }
  };

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
    setStatus("idle");
    setErrorMessage(null);
    setResults(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <Modal
      isOpen
      onClose={close}
      className="max-w-[700px] m-4"
      showCloseButton={false}
      outsideClick={false}
    >
      <div className="flex flex-col bg-white dark:bg-black rounded-3xl overflow-hidden min-h-[400px]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 lg:px-11 pt-8">
          <h2 className="text-2xl font-semibold text-black dark:text-white/90">Import Freelancers</h2>
          <button
            onClick={close}
            className="text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 lg:px-11 space-y-6 overflow-y-auto max-h-[70vh] custom-scrollbar">
          {!results ? (
            <>
              {/* Download Section */}
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl flex items-center justify-between border border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-black dark:text-white" />
                  <div>
                    <p className="text-sm font-semibold text-black dark:text-white">Sample Template</p>
                    <p className="text-xs text-black/60 dark:text-white/60">Download the required CSV format</p>
                  </div>
                </div>
                <button
                  onClick={handleDownloadTemplate}
                  className="flex items-center gap-1.5 text-xs font-bold text-black dark:text-white hover:opacity-70 transition-opacity underline decoration-black/30 underline-offset-4"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download
                </button>
              </div>

              {/* Upload Section */}
              <div
                className={`relative border-2 border-dashed rounded-2xl p-10 transition-all flex flex-col items-center justify-center text-center cursor-pointer ${
                  file
                    ? "border-black bg-white"
                    : "border-black/20 dark:border-white/20 bg-gray-50/30 dark:bg-gray-900/10 hover:border-black dark:hover:border-white hover:bg-gray-50 dark:hover:bg-gray-900"
                }`}
                onClick={() => status === "idle" && fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {status === "uploading" ? (
                  <div className="flex flex-col items-center">
                    <Loader2 className="w-12 h-12 text-black dark:text-white animate-spin mb-4" />
                    <p className="text-sm font-medium text-black dark:text-white">Uploading and processing...</p>
                  </div>
                ) : status === "success" ? (
                  <div className="flex flex-col items-center">
                    <CheckCircle2 className="w-12 h-12 text-green-500 mb-4" />
                    <p className="text-sm font-medium text-green-600 dark:text-green-400">Processing completed!</p>
                  </div>
                ) : file ? (
                  <div className="flex flex-col items-center">
                    <div className="bg-white dark:bg-black p-4 rounded-full shadow-sm mb-4 border border-gray-100 dark:border-gray-800">
                  <FileText className="w-8 h-8 text-black dark:text-white" />
                </div>
                <Tooltip text={file.name}>
                  <p className="text-sm font-semibold text-black dark:text-white truncate max-w-[200px] mb-1">
                    {file.name}
                  </p>
                </Tooltip>
                <p className="text-xs text-gray-500 mb-4 font-medium">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
                    <button
                      onClick={clearFile}
                      className="text-xs text-red-600 hover:text-red-700 font-bold underline decoration-red-600/30 underline-offset-4"
                    >
                      Remove file
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="bg-white dark:bg-black p-5 rounded-full shadow-sm mb-5 border border-gray-100 dark:border-gray-800">
                      <Upload className="w-10 h-10 dark:text-white/40" />
                    </div>
                    <p className="text-base font-bold text-black dark:text-white mb-1">Click to upload CSV</p>
                    <p className="text-xs text-gray-500 font-medium tracking-wide uppercase">or drag and drop file here</p>
                  </div>
                )}

                {status === "error" && (
                  <div className="mt-4 flex items-center gap-2 text-red-600 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg w-full border border-red-100 dark:border-red-900/30">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <p className="text-xs text-left font-medium">{errorMessage}</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Results Section */
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 text-center">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Total</p>
                  <p className="text-2xl font-bold text-black dark:text-white">{results.total_rows}</p>
                </div>
                <div className="bg-green-50/50 dark:bg-green-900/10 p-4 rounded-2xl border border-green-100 dark:border-green-900/20 text-center">
                  <p className="text-xs font-bold text-green-600 uppercase tracking-widest mb-1">Imported</p>
                  <p className="text-2xl font-bold text-green-600">{results.imported_count}</p>
                </div>
                <div className="bg-red-50/50 dark:bg-red-900/10 p-4 rounded-2xl border border-red-100 dark:border-red-900/20 text-center">
                  <p className="text-xs font-bold text-red-600 uppercase tracking-widest mb-1">Skipped</p>
                  <p className="text-2xl font-bold text-red-600">{results.skipped_count}</p>
                </div>
              </div>

              {results.errors.length > 0 && (
                <div className="space-y-3">
                  <p className="text-sm font-bold text-black dark:text-white px-1">Detailed Errors</p>
                  <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                    {results.errors.map((error, index) => (
                      <div key={index} className="p-4 rounded-xl border border-red-100 dark:border-red-900/30 bg-red-50/20 dark:bg-red-900/5 flex gap-4">
                        <div className="h-8 w-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-red-600">{error.row}</span>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-black dark:text-white">{error.email}</p>
                          <p className="text-[11px] text-red-600 leading-relaxed font-medium">{error.error}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {results.imported_count === results.total_rows && (
                <div className="flex flex-col items-center justify-center py-8 text-center bg-green-50/20 rounded-3xl border border-dashed border-green-200">
                  <CheckCircle2 className="w-12 h-12 text-green-500 mb-3" />
                  <p className="text-sm font-bold text-green-700">All rows imported successfully!</p>
                </div>
              )}
              
              <button 
                onClick={() => {
                  setResults(null);
                  setFile(null);
                  setStatus("idle");
                }}
                className="mx-auto w-fit px-8 py-3 text-xs font-bold text-black dark:text-white border border-black/10 dark:border-white/10 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center"
              >
                Upload Another File
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-center items-center gap-3 px-6 lg:px-11 pb-10 mt-auto">
          <Button
            variant="dark"
            disabled={status === "uploading"}
            onClick={(e) => {
              e.stopPropagation();
              close();
            }}
          >
            {results ? "Done" : "Close"}
          </Button>

          {!results && (
            <>
              {!file ? (
                <Tooltip text="Please select a file first">
                  <Button disabled variant="primary">
                    Import
                  </Button>
                </Tooltip>
              ) : (
                <Button
                  disabled={status === "uploading" || status === "success"}
                  loadingState={status === "uploading"}
                  onClick={handleUpload}
                >
                  {status === "success" ? "Imported" : "Import"}
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ImportFreelancersModal;
