"use client";

import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogTitle, 
  DialogDescription,
  Button, 
  Form,
  FormField,
  FormItem,
  Field,
  FieldError,
  FieldGroup,
  InputGroupTextarea,
  Label
} from "@repo/ui/index";
import { ModalEntry } from "@/store/useModalStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import postService from "@/lib/api/services/postService";
import { ToastService } from "@/lib/utilities/toastService";
import { MessageSquareWarning } from "lucide-react";

const reportSchema = z.object({
  reason: z.string().min(5, "Reason must be at least 5 characters long").max(500, "Reason must be at most 500 characters long"),
});

type ReportFormValues = z.infer<typeof reportSchema>;

interface ReportPostModalProps {
  modal: ModalEntry;
  onClose: () => void;
}

const ReportPostModal = ({ modal, onClose }: ReportPostModalProps) => {
  const post = (modal.data as any)?.post;
  const [isLoading, setIsLoading] = useState(false);

  const reportForm = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      reason: "",
    }
  });

  const onSubmit = async (values: ReportFormValues) => {
    if (!post?.id) return;
    setIsLoading(true);
    try {
      const response: any = await postService.reportPost(post.id, values.reason);
      if (response?.status === true || response?.status === 200 || response?.status === 201) {
        ToastService.success("Post reported successfully. Thank you for your feedback!");
        onClose();
      } else {
        ToastService.error(response?.message || "Failed to report post");
      }
    } catch (error: any) {
      ToastService.error(error?.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[360px] px-6 py-8 bg-white border-0 shadow-xl rounded-3xl overflow-hidden items-center z-[100]">
        <DialogTitle className="sr-only">Report Post</DialogTitle>
        <div className="flex flex-col items-center text-center space-y-6 w-full">
          <div className="space-y-2">
            <h3 className="text-[22px] font-[500] text-gray-900 mb-2">
              Report Post
            </h3>
            <p className="text-gray-500 text-[15px]">
              Tell us why you're reporting this content.
            </p>
          </div>

          <Form {...reportForm}>
            <form onSubmit={reportForm.handleSubmit(onSubmit)} className="w-full space-y-4">
              <FieldGroup className="text-left">
                <FormField
                  control={reportForm.control}
                  name="reason"
                  render={({ field, fieldState }: { field: any; fieldState: any }) => (
                    <FormItem>
                      <Field data-invalid={fieldState.invalid}>
                        <Label className="text-sm font-medium text-gray-700 ml-1 mb-2 block">
                          Reason for reporting
                        </Label>
                        <InputGroupTextarea
                          {...field}
                          placeholder="E.g., Spam, Harassment, Inappropriate content..."
                          className="min-h-[120px] rounded-xl border-gray-100 focus:ring-[#D16DF2] focus:border-[#D16DF2] resize-none p-4"
                          isSpaceAtStart={false}
                          showEllipsis={false}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    </FormItem>
                  )}
                />
              </FieldGroup>

              <div className="flex flex-col w-full pt-2 justify-center gap-2">
                <Button
                  type="submit"
                  disabled={isLoading}
                  loadingState={isLoading}
                  className="w-full h-11 bg-[#D16DF2] hover:bg-[#D16DF2]/90 text-white font-semibold transition-all active:scale-[0.98] rounded-lg"
                >
                  Submit Report
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="w-full h-11 rounded-lg border-gray-200 text-gray-800 font-semibold hover:bg-gray-50"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportPostModal;
