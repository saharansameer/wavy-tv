import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { commentFormSchema, CommentFormSchemaType } from "@/app/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  LoadingOverlay,
  AuthUser,
  TextEditor,
  ErrorMessage,
} from "@/components";
import { Button } from "@/components/ui";
import useAuthStore from "@/app/store/authStore";
import { axios } from "@/app/config/axios";
import { verifyAndGenerateNewToken } from "@/utils/tokenUtils";
import { showToast } from "@/utils/toast";
import { setQueryInvalid } from "@/utils/reactQueryUtils";
import { useParams } from "react-router-dom";

interface CommentFormProps {
  mode?: "post" | "patch";
  entity: "video" | "post" | "comment";
  entityPublicId: string;
  data?: any;
  commentId?: string;
  onClose?: () => void;
}

export function CommentForm({
  mode,
  entity,
  entityPublicId,
  data,
  commentId,
  onClose,
}: CommentFormProps) {
  const isEditMode = mode === "patch";
  const { authenticated } = useAuthStore();
  const { publicId } = useParams();

  const {
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CommentFormSchemaType>({
    resolver: zodResolver(commentFormSchema),
    mode: "onChange",
    reValidateMode: "onSubmit",
    defaultValues: {
      content: isEditMode ? data.content : "",
    },
  });

  // Form Submit Handler
  const onSubmitHandler: SubmitHandler<CommentFormSchemaType> = async (
    data
  ) => {
    try {
      // Check Auth
      if (!(await verifyAndGenerateNewToken())) return;

      // Content
      const { content } = data;

      // Edit Mode - Form
      if (isEditMode) {
        // PATCH request
        await axios.patch(`/api/v1/comment/update/${commentId}`, { content });

        onClose?.();
        showToast("comment-edit");

        await setQueryInvalid({
          queryKey: ["comments", publicId as string],
        });

        return;
      }

      // Send comment 'POST' request
      await axios.post(
        `/api/v1/comment/${entity}?${entity}PublicId=${entityPublicId}`,
        { content }
      );
    } catch (error) {
      console.error("Comment Form Error:", error);
    }

    showToast("comment-create");
    await setQueryInvalid({
      queryKey: ["comments", publicId as string],
    });

    reset();
  };

  if (isSubmitting) {
    return <LoadingOverlay />;
  }

  return (
    <div
      className={`w-full flex flex-col gap-y-2 p-4 ${isEditMode ? "items-center" : ""}`}
    >
      {!isEditMode && <AuthUser />}

      {authenticated && (
        <form
          onSubmit={handleSubmit(onSubmitHandler)}
          className={`w-full max-w-xl flex flex-col gap-y-3`}
        >
          <div className="w-full">
            <Controller
              control={control}
              name="content"
              render={({ field }) => (
                <>
                  <TextEditor
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Your thoughts..."
                    className="max-w-xl"
                  />
                </>
              )}
            />
            {errors.content && (
              <ErrorMessage text={errors.content.message as string} />
            )}
          </div>

          <Button type="submit" className="max-w-28 font-semibold">
            {isEditMode
              ? "Save Changes"
              : entity === "comment"
                ? "Reply"
                : "Comment"}
          </Button>
        </form>
      )}
    </div>
  );
}
